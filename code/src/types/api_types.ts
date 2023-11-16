export interface IChoice {
  id: string;
  title: string;
}

export interface IQuestion {
  id: string;
  title: string;
  description?: string    //updated with optional description field
}

export interface ISolution {
  id: string;
  title: string;
}

export interface IBodyContent {
  question: IQuestion,
  prevChoice: IChoice,
  choiceList: IChoice[]
}
