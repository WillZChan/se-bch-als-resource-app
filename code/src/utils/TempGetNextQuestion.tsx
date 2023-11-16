import { IChoice, IQuestion, ISolution } from '../types/api_types';
import { API_URL } from '../constants/globals';

/**
 * Fetches data from the API at the given URL and returns it as JSON.
 * Throws an error if the fetch request fails.
 * 
 * @param APIURL - The URL to fetch data from.
 * @returns The JSON data returned by the API.
 */
const fetchAnyData = async (APIURL:string): Promise<any> => {
  const res = await fetch(APIURL, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${APIURL}`);
  }

  return await res.json();
}

/**
 * Gets the next question and choices from the API based on the clicked choice.
 * 
 * @param clickedChoice - The choice that was clicked.
 * @returns An array containing the next question, choices, whether there's a solution, and the solution (if there is one).
 */
export default async function tempNextChoiceSelectionFromJson(clickedChoice : IChoice): Promise<[IQuestion, IChoice[], boolean, ISolution]> {
  let choices_list : IChoice[] = []
  let question : IQuestion = {id:"", title:""}
  let hasSolution = false
  let solution : ISolution = {id: "", title: ""}

  try {
    if (clickedChoice.title == "Home"){
      const question_json = await fetchAnyData(API_URL+"/api/first-entries/1?populate=*")

      // Get the first question from the data returned by the API
      question = {
        id: question_json.data.attributes.question_to_choice_maps.data[0].id,
        title: question_json.data.attributes.question_to_choice_maps.data[0].attributes.QuestionName
      }
    } else {
      const question_json = await fetchAnyData(`${API_URL}/api/choice-to-question-maps/${clickedChoice.id}?populate=*`);

      // If there's no next question, check if there's a solution and return it
      if (question_json.data.attributes.choice_to_question.data == null){
        if (question_json.data.attributes.ChoiceToSolutionMap.data != null){
          hasSolution = true
          solution = {
            id: question_json.data.attributes.ChoiceToSolutionMap.data.id,
            title: question_json.data.attributes.ChoiceToSolutionMap.data.attributes.Title
          }
        }
        return [question, choices_list, hasSolution, solution]
      }

      // Get the next question from the data returned by the API
      question = {
        id: question_json.data.attributes.choice_to_question.data.id,
        title: question_json.data.attributes.choice_to_question.data.attributes.QuestionName,
        description: question_json.data.attributes.choice_to_question.data.attributes.QuestionDescription 
      }
    }

    // Get the choices for the current question from the API
    const choice_json = await fetchAnyData(API_URL+"/api/question-to-choice-maps/"+question.id+"?populate=*")
    let temp_choicesjson = choice_json.data.attributes.question_to_choices.data

    for (const element of temp_choicesjson) {
      choices_list.push({id: element.id, title: element.attributes.ChoiceName})
    }
  } catch (error) {
    console.error(error);
    // handle the error as needed, e.g. show a notification to the user
  }

  return [question, choices_list, hasSolution, solution]
}
