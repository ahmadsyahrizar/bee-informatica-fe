import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PayloadMemoRequest } from "@/types/api/memo.type";
const API_UPDATE_EMAIL_AND_PHONE = `${BASE_API_URL}`;

// const dummyMemo = {
//  "data": [
//   {
//    "id": 2,
//    "user": {
//     "first_name": "update",
//     "last_name": "update",
//     "created_at": "0001-01-01T00:00:00Z",
//     "updated_at": "0001-01-01T00:00:00Z"
//    },
//    "application_id": 151,
//    "stage": "phone",
//    "memo": "test2",
//    "reason": "123",
//    "created_by": 1,
//    "updated_by": 1,
//    "created_at": "2025-10-11T15:02:18.939976Z",
//    "updated_at": "2025-10-11T15:07:26.341392Z"
//   },
//   {
//    "id": 4,
//    "user": {
//     "first_name": "update",
//     "last_name": "update",
//     "created_at": "0001-01-01T00:00:00Z",
//     "updated_at": "0001-01-01T00:00:00Z"
//    },
//    "application_id": 151,
//    "stage": "video",
//    "memo": "test23",
//    "reason": "",
//    "created_by": 1,
//    "updated_by": 1,
//    "created_at": "2025-10-11T15:27:06.326538Z",
//    "updated_at": "2025-10-11T15:27:33.438883Z"
//   },
//   {
//    "id": 11,
//    "user": {
//     "first_name": "update",
//     "last_name": "update",
//     "created_at": "0001-01-01T00:00:00Z",
//     "updated_at": "0001-01-01T00:00:00Z"
//    },
//    "application_id": 151,
//    "stage": "offer",
//    "memo": "approved!!!",
//    "reason": "",
//    "created_by": 1,
//    "updated_by": 1,
//    "created_at": "2025-10-24T08:24:04.721641Z",
//    "updated_at": "2025-10-24T08:24:04.721641Z"
//   },
//   {
//    "id": 12,
//    "user": {
//     "first_name": "update",
//     "last_name": "update",
//     "created_at": "0001-01-01T00:00:00Z",
//     "updated_at": "0001-01-01T00:00:00Z"
//    },
//    "application_id": 151,
//    "stage": "completed",
//    "memo": "",
//    "reason": "ok!",
//    "created_by": 1,
//    "updated_by": 1,
//    "created_at": "2025-10-24T09:27:25.444322Z",
//    "updated_at": "2025-10-24T09:30:36.391042Z"
//   },
//   {
//    "id": 6,
//    "user": {
//     "first_name": "update",
//     "last_name": "update",
//     "created_at": "0001-01-01T00:00:00Z",
//     "updated_at": "0001-01-01T00:00:00Z"
//    },
//    "application_id": 151,
//    "stage": "rejected",
//    "memo": "memo",
//    "reason": "reason",
//    "created_by": 1,
//    "updated_by": 1,
//    "created_at": "2025-10-13T11:40:25.496182Z",
//    "updated_at": "2025-10-13T11:40:25.496183Z"
//   },
//   {
//    "id": 7,
//    "user": {
//     "first_name": "update",
//     "last_name": "update",
//     "created_at": "0001-01-01T00:00:00Z",
//     "updated_at": "0001-01-01T00:00:00Z"
//    },
//    "application_id": 151,
//    "stage": "cancelled",
//    "memo": "memo2",
//    "reason": "reason2",
//    "created_by": 1,
//    "updated_by": 1,
//    "created_at": "2025-10-13T11:41:27.780317Z",
//    "updated_at": "2025-10-13T11:41:27.780319Z"
//   }
//  ]
// }

interface PropGetMemo {
 accessToken: string;
 caseId: string;
 stage: PayloadMemoRequest['stage']
}

const GetMemo = async <TResponse = "unknown">({ accessToken, caseId, stage }: PropGetMemo) => {
 const res = await fetcher<TResponse>(`${API_UPDATE_EMAIL_AND_PHONE}/${caseId}/memo?stage=${stage}`, {
  method: "GET",
  token: accessToken,
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res?.data
};

export default GetMemo  