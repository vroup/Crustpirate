export class Answer {
  _id: string;
  answer: string;
  questionId: string;
  votesFor: number;
  votesAgainst: number;
  createTime: Date;
}
