export type TrendData = {
  date: string;
  value: number | string;
};

export type CheckInStatistics = {
  totalCheckIns: number;
  dateRange: {
    start: string;
    end: string;
  };
  averages: {
    bleeding?: number;
    pain?: number;
  };
  trends: {
    bleeding: TrendData[];
    pain: TrendData[];
    mouthFeeling: TrendData[];
    hygieneHabits: TrendData[];
  };
};




