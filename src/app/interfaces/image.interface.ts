export interface Photo {
  _id?: string,
  uri: string,
  name: string,
  type: ['jpg', 'png'],
  data: {
    size: number,
    width: number,
    height: number
  },
  date: string,
  user_id: string
}
