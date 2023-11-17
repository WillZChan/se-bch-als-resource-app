import { HandoutOrTestimonialLink, PageContentType, ResourceLink } from "../types/dataTypes";
import { API_URL } from '../constants/globals';

/**
 * Fetches data from the specified API URL.
 *
 * @param APIURL - The URL of the API to fetch data from.
 * @returns A Promise that resolves to the parsed JSON response from the API.
 * @throws An error if the fetch request fails.
 */
const fetchAnyData = async (APIURL: string): Promise<any> => {
  const res = await fetch(APIURL, {
    method: "GET",
  });

  // Throw an error if the fetch request failed
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${APIURL}`);
  }

  // Return the parsed JSON response
  return await res.json();
}

/**
 * Parses the resource links from the specified solution JSON data.
 *
 * @param solution_json - The JSON data for a solution.
 * @returns An array of resource links parsed from the solution JSON data.
 */
function getResourceContent(solution_json: any): ResourceLink[] {
  let temp_resource_list: ResourceLink[] = [];

  // Check if there are resources in the solution data
  if (solution_json.data.attributes.Resources.length) {
    for (let j = 0; j < solution_json.data.attributes.Resources.length; j++) {
      // Add the resource link to the list of resources
      temp_resource_list.push({
        id: "" + j,
        title: solution_json.data.attributes.Resources[j].ResourceTitle,
        url: solution_json.data.attributes.Resources[j].ResourceLink
      })
    }
  }

  // Return the list of resources
  return temp_resource_list
}

/**
 * Parses the handouts or testimonials links from the specified solution JSON data.
 *
 * @param api_url - The URL of the API.
 * @param solution_json - The JSON data for a solution.
 * @returns An array of handouts or testimonials links parsed from the solution JSON data.
 */
function getTestimonialOrHandoutContent(api_url: string, solution_json: any): HandoutOrTestimonialLink[] {
  let temp_handoutsOrTestimonialsList: HandoutOrTestimonialLink[] = []

  // Check if there are handouts or testimonials in the solution data
  if (solution_json.data.attributes.TestimonialsOrHandouts) {
    for (let j = 0; j < solution_json.data.attributes.TestimonialsOrHandouts.length; j++) {
      if (solution_json.data.attributes.TestimonialsOrHandouts[j].Link) {
        // If the handout or testimonial has a link, add it to the list of handouts or testimonials
        temp_handoutsOrTestimonialsList.push({
          id: "" + j,
          title: solution_json.data.attributes.TestimonialsOrHandouts[j].Title,
          url: solution_json.data.attributes.TestimonialsOrHandouts[j].Link
        })
      } else {
        // If the handout or testimonial doesn't have a link, construct the URL from the API URL and the handout or testimonial data and add it to the list of handouts or testimonials
        temp_handoutsOrTestimonialsList.push({
          id: "" + j,
          title: solution_json.data.attributes.TestimonialsOrHandouts[j].Title,
          url: api_url + solution_json.data.attributes.TestimonialsOrHandouts[j].PDF.data.attributes.url
        })
      }
    }
  }

  // Return the list of handouts or testimonials
  return temp_handoutsOrTestimonialsList
}

/**
 * Parses the page content from the specified solution JSON data.
 *
/**

Parses the page content from the specified solution JSON data.
@param api_url - The URL of the API.
@param solution_json - The JSON data for a solution.
@returns An array of page content parsed from the solution JSON data.
*/
function getPageContent(api_url: string, solution_json : any) : PageContentType[]{
  let temp_pageContentList : PageContentType[] = []
  let element : any = solution_json.data.attributes.Block
  // If the "Block" field exists in the solution data
  if(element){
  // Iterate over each element in the "Block" array
    for (let j = 0; j < element.length; j++) {
      // If the element represents a video, add the video URL to the page content list
      if (element[j].__component == "video.video"){
        temp_pageContentList.push({id:""+j, paragraph: "", imageURL: "", videoURL: api_url+element[j].VideoMedia.data.attributes.url})
        // If the element represents a description, add the description paragraph to the page content list
      }else if (element[j].__component == "description-paragraphs.description-paragraphs"){
        temp_pageContentList.push({id:""+j, paragraph: element[j].DescriptionParagraph, imageURL: "", videoURL: ""})
        // If the element represents an image, add the image URL to the page content list
      } else if (element[j].__component == "image.image"){
        temp_pageContentList.push({id:""+j, paragraph: "", imageURL: api_url+element[j].ImageMedia.data.attributes.formats.thumbnail.url, videoURL: ""})
      }
    }
  }
  
  return temp_pageContentList
  }
  
  /**
   * Fetches the content for the specified solution ID.
   * 
   * @param solutionId - The ID of the solution to fetch content for.
   * @returns A Promise that resolves to an array containing the solution title, description,
   * resource links, handouts or testimonials links, and page content for the specified solution.
   * If an error occurs, the function returns an array of empty values.
   */
export default async function getSolutionContent(solutionId: string): Promise<[string, string, ResourceLink[], HandoutOrTestimonialLink[], PageContentType[]]> {
  let resourceList: ResourceLink[] = [];
  let handoutsOrTestimonialsList: HandoutOrTestimonialLink[] = [];
  let pageContentList: PageContentType[] = [];

  try {
    // Fetch the solution data for the specified ID
    const solution_json = await fetchAnyData(API_URL + "/api/solutions/" + solutionId + "?populate=deep,3");
    
    // Get the solution title and description from the solution data
    const title = solution_json.data.attributes.Title;
    const description = solution_json.data.attributes.SolutionDescription || ""; // Fetch SolutionDescription

    // Parse resource links, handouts/testimonials, and page content
    handoutsOrTestimonialsList = getTestimonialOrHandoutContent(API_URL, solution_json);
    resourceList = getResourceContent(solution_json);
    pageContentList = getPageContent(API_URL, solution_json);

    // Return an array containing the solution title, description, resource links, handouts or testimonials links, and page content
    return [title, description, resourceList, handoutsOrTestimonialsList, pageContentList];
  } catch (error) {
    console.error(error);
    return ['', '', [], [], []]; // Return empty values in case of an error
  }
}