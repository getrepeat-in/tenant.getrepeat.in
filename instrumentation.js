import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const posthogLogsProvider =
    projectToken && host
        ? new LoggerProvider({
              resource: resourceFromAttributes({
                  "service.name": "nearby-customer",
              }),
              processors: [
                  new BatchLogRecordProcessor({
                      exporter: new OTLPLogExporter({
                          url: `${host.replace(/\/$/, "")}/i/v1/logs`,
                          headers: {
                              Authorization: `Bearer ${projectToken}`,
                              "Content-Type": "application/json",
                          },
                      }),
                  }),
              ],
          })
        : null;

export const posthogOrderLogger = posthogLogsProvider?.getLogger(
    "posthog-order-route"
);

export { SeverityNumber };

export function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") {
        return;
    }

    if ((!projectToken || !host) && process.env.NODE_ENV === "development") {
        const missingVariable = !projectToken
            ? "NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN"
            : "NEXT_PUBLIC_POSTHOG_HOST";

        throw new Error(
            `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
        );
    }
}
