import { UserLiveDataProps } from "./LiveModels"
import { UserSeriesDataProps } from "./SeriesModels"
import { UserVodDataProps } from "./VodModels"

export interface UserDataProps {
  vod?: UserVodDataProps[],
  series?: UserSeriesDataProps[],
  live?: UserLiveDataProps[]
}