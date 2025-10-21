import dayjs from "dayjs"

const getDiffYear = (startYear: number | string): number => {
 const startDate = dayjs(`${startYear}-01-01`);
 const yearsPassed = dayjs().diff(startDate, "year");

 return yearsPassed;
};

export default getDiffYear;
