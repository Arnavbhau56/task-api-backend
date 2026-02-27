'use strict'

const { NodeSDK } = require('@opentelemetry/sdk-node')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http')
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express')
const { resourceFromAttributes } = require('@opentelemetry/resources')
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions')

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'task-api-backend',
  }),

  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces',
  }),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://localhost:4318/v1/metrics',
    }),
    exportIntervalMillis: 10000,
  }),

  instrumentations: [
    new HttpInstrumentation({
      requestHook: (span, request) => {
        span.setAttribute('http.method', request.method)
      },
    }),
    new ExpressInstrumentation(),
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-http': { enabled: false },
      '@opentelemetry/instrumentation-express': { enabled: false },
    }),
  ],
})

sdk.start()
console.log('OpenTelemetry SDK started - sending data to SigNoz')

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OTel SDK shut down successfully'))
    .catch((error) => console.log('Error shutting down OTel SDK', error))
    .finally(() => process.exit(0))
})

module.exports = sdk