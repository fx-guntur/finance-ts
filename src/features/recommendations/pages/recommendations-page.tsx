import { motion } from "framer-motion";
import { Badge } from "../../../components/ui/badge";
import { Card } from "../../../components/ui/card";
import { EmptyState } from "../../../components/feedback/empty-state";
import { LoadingState } from "../../../components/feedback/loading-state";
import { SectionHeader } from "../../../components/layout/section-header";
import { fadeInUp, staggerChildren } from "../../../lib/motion";
import { useRecommendations } from "../hooks/use-recommendations";
import { RecommendationControls } from "../components/recommendation-controls";
import { RecommendationDetailPanels } from "../components/recommendation-detail-panels";
import { RecommendationSummary } from "../components/recommendation-summary";
import { useTranslations } from "../../../i18n/use-translations";

const DEMO_USER_ID = "demo-user";
const CURRENCY = "IDR";

export function RecommendationsPage() {
  const { t, locale } = useTranslations();
  const {
    overview,
    selectedDate,
    setSelectedDate,
    holidayDates,
    setHolidayDates,
    isLoading,
    error,
    reload,
  } = useRecommendations(DEMO_USER_ID);

  return (
    <motion.div variants={staggerChildren} initial="hidden" animate="visible" className="space-y-5">
      <motion.section variants={fadeInUp}>
        <SectionHeader
          title={t("recommendations.title")}
          description={t("recommendations.description")}
          action={<Badge variant="primary">{t("recommendations.engine")}</Badge>}
        />
      </motion.section>

      <motion.section variants={fadeInUp}>
        <RecommendationControls
          selectedDate={selectedDate}
          holidayDates={holidayDates}
          onSelectedDateChange={setSelectedDate}
          onHolidayDatesChange={setHolidayDates}
          onRefresh={() => {
            void reload(selectedDate, holidayDates);
          }}
          isLoading={isLoading}
        />
      </motion.section>

      {error ? (
        <motion.section variants={fadeInUp}>
          <EmptyState
            title={locale === "id" ? "Gagal memuat rekomendasi" : "Unable to load recommendations"}
            description={error}
            actionLabel={t("common.retry")}
            onAction={() => {
              void reload(selectedDate, holidayDates);
            }}
          />
        </motion.section>
      ) : null}

      {isLoading ? (
        <motion.section variants={fadeInUp}>
          <LoadingState label={t("recommendations.loading")} />
        </motion.section>
      ) : (
        <>
          <motion.section variants={fadeInUp}>
            <RecommendationSummary overview={overview} currency={CURRENCY} />
          </motion.section>

          <motion.section variants={fadeInUp}>
            <RecommendationDetailPanels overview={overview} currency={CURRENCY} />
          </motion.section>
        </>
      )}
    </motion.div>
  );
}
