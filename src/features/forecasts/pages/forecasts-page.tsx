import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { EmptyState } from "../../../components/feedback/empty-state";
import { LoadingState } from "../../../components/feedback/loading-state";
import { SectionHeader } from "../../../components/layout/section-header";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { useForecasts } from "../hooks/use-forecasts";
import { ForecastControls } from "../components/forecast-controls";
import { ForecastSummary } from "../components/forecast-summary";
import { ForecastScenarioGrid } from "../components/forecast-scenario-grid";
import { ForecastPathCard } from "../components/forecast-path-card";
import { ForecastImpactPanel } from "../components/forecast-impact-panel";
import { ForecastMlPanel } from "../components/forecast-ml-panel";
import { useTranslations } from "../../../i18n/use-translations";

const DEMO_USER_ID = "demo-user";
const CURRENCY = "IDR";

export function ForecastsPage() {
  const { t, locale } = useTranslations();
  const {
    overview,
    selectedDate,
    setSelectedDate,
    horizonDays,
    setHorizonDays,
    isLoading,
    error,
    reload,
  } = useForecasts(DEMO_USER_ID);

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-5">
      <motion.section variants={fadeInUp}>
        <SectionHeader
          title={t("forecast.title")}
          description={t("forecast.description")}
          action={<Badge variant="primary">{t("forecast.engine")}</Badge>}
        />
      </motion.section>

      <motion.section variants={fadeInUp}>
        <ForecastControls
          selectedDate={selectedDate}
          horizonDays={horizonDays}
          onSelectedDateChange={setSelectedDate}
          onHorizonDaysChange={setHorizonDays}
          onRefresh={() => {
            void reload(selectedDate, horizonDays);
          }}
          isLoading={isLoading}
        />
      </motion.section>

      {error ? (
        <motion.section variants={fadeInUp}>
          <EmptyState
            title={locale === "id" ? "Gagal memuat perkiraan" : "Unable to load forecasts"}
            description={error}
            actionLabel={t("common.retry")}
            onAction={() => {
              void reload(selectedDate, horizonDays);
            }}
          />
        </motion.section>
      ) : null}

      {isLoading ? (
        <motion.section variants={fadeInUp}>
          <LoadingState label={t("forecast.loading")} />
        </motion.section>
      ) : (
        <>
          <motion.section variants={fadeInUp}>
            <ForecastSummary overview={overview} currency={CURRENCY} />
          </motion.section>

          <motion.section variants={staggerChildren} className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <ForecastImpactPanel overview={overview} currency={CURRENCY} />
            <ForecastMlPanel mlSignals={overview.mlSignals} />
          </motion.section>

          <motion.section variants={fadeInUp}>
            <ForecastScenarioGrid scenarios={overview.scenarios} currency={CURRENCY} />
          </motion.section>

          <motion.section variants={fadeInUp}>
            <ForecastPathCard scenario={overview.activeScenario} currency={CURRENCY} />
          </motion.section>

          <motion.section variants={fadeInUp}>
            <Card className="space-y-3">
              <SectionHeader
                title={t("forecast.notes.title")}
                description={t("forecast.notes.description")}
              />
              <div className="grid gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                <div>{t("forecast.notes.line1")}</div>
                <div>{t("forecast.notes.line2")}</div>
                <div>{t("forecast.notes.line3")}</div>
              </div>
            </Card>
          </motion.section>
        </>
      )}
    </motion.div>
  );
}
