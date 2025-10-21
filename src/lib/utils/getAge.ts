import dayjs from "dayjs";

const getAge = (dob: string): number => {
 const age = dayjs().diff(dayjs(dob), "year");

 return age;
}

export default getAge;