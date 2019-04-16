export interface Image {
  _id?: string,
  uri: string,
  name: string,
  type: string,
  data: {
    size: number,
    width: number,
    height: number
  },
  date_time: {date: string, time: string},
  user_id: string
}
