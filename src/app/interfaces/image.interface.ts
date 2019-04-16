export interface Image {
  _id?: string,
  uri: string,
  name: string,
  type: string,
  date_time: {date: string, time: string},
  user_id: string
}
