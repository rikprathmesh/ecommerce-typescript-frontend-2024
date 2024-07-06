import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { MessageResponse } from "../types/api-types";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

type ResType =
  | {
      data: MessageResponse;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

export const responseToast = (
  res: ResType,
  navigate: NavigateFunction | null,
  url: string
) => {
  if ("data" in res) {
    toast.success(res.data.message);
    if (navigate) navigate(url);
  } else {
    const error = res.error as FetchBaseQueryError;
    const MessageResponse = error.data as MessageResponse;
    toast.error(MessageResponse.message);
  }
};

export const getLastMonth = () => {
  const currentDate = moment()

  currentDate.date(1)
  const lastSixMonths: string[] = []
  const lastTwelveMonths: string[] = []

  for (let index = 0; index < 6; index++) {
    const monthDate = currentDate.clone().subtract(index, "months");
    const monthName = monthDate.format("MMMM")

    lastSixMonths.unshift(monthName)
    
  }
  for (let index = 0; index < 12; index++) {
    const monthDate = currentDate.clone().subtract(index, "months");
    const monthName = monthDate.format("MMMM")

    lastTwelveMonths.unshift(monthName)
    
  }
  return {
    lastSixMonths,
    lastTwelveMonths
  }
}