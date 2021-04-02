import 'bootstrap';
import "bootstrap/dist/css/bootstrap.css"; // Import precompiled Bootstrap css
import "@fortawesome/fontawesome-free/css/all.css";
import "./main.scss";


//define UI varibles

const card = document.querySelector(".card");
const addBtn = document.querySelector("#add");
const editBtn = document.querySelector("#edit");
const tagList = document.querySelector(".tagList");
const textArea = document.querySelector("#textarea");

// load all event listeners
loadEventListeners();

//load event listeners
function loadEventListeners(){
  //Load DOM contents
  document.addEventListener("DOMContentLoaded",getTags);
  //add tag event
  addBtn.addEventListener("click",addTags);
  //add remove events
  tagList.addEventListener("click",function(e){
    // alert("w");
    if(e.target.id === "close"){
      e.target.addEventListener('click',removeTag(parseInt(e.target.parentElement.id)))
    }
  })
  // add edit event
  editBtn.addEventListener("click",editTags);
  //listen from enter
  textArea.addEventListener("keypress",submitOnEnter);
}

// Submit by CTRL + ENTER
function submitOnEnter(event){
  if (event.ctrlKey && event.keyCode == 13){
      addTags();
      event.preventDefault();
  }
}

//Get tags from Local storage
function getTags(){
  let tags;
  let colorValue;

  clearTags();

  //get tags from local storage
  if(localStorage.getItem("tags")===null){
    tags = [];
  }else{
    tags = JSON.parse(localStorage.getItem("tags"));
  }

  //show tags
  tags.forEach(function(tag){
    //
    let tagValue = tag[1];
    if(tagValue>=0){
      colorValue = 'red';
    }else{
      colorValue = 'blue';
    }
    //create div element
    const divElement = document.createElement("div"); 
    //add class
    divElement.className = "chip " + colorValue;
    //create text node and append to divElement
    divElement.appendChild(document.createTextNode(tagValue));
    //add id to div element
    divElement.id = String(tag[0]);
    //create the link element
    const closeElement = document.createElement("i");
    //add class to close element
    closeElement.className = "close material-icons";
    //add id to close element
    closeElement.id = "close";
    //add text node to close element
    closeElement.textContent = "close";
    //Append closeElement to div element
    divElement.appendChild(closeElement);
    //Append divElement to tagList
    tagList.appendChild(divElement);
  


  })
}


//Add tags function
function addTags(){
  let txtConent = document.querySelector('#textarea').value;

  // check if the input is empty
  if(txtConent == ""){
    alert("Input can not be empty");
  }

  //parse the tag value
  let splitList;
  splitList = parseTags(txtConent);
  // save splitList to local storage
  storeTagsInLocalStorage(splitList);
  //display tags
  getTags();
  //clear input
  document.querySelector('#textarea').value = "";

}


//Parse tags
function parseTags(inputString){
  let splitList;
  splitList = inputString.split(/(?:,|;|\r\n|\n|\r| )+/);
  let returnList = [];
  for(let i=0; i<splitList.length;i++){
    if(!isNaN(parseInt(splitList[i]))){
      returnList.push(parseInt(splitList[i]));
    }
  } 
  return(returnList);
}

//store tags in local storage
function storeTagsInLocalStorage(tags){
  let originalTags;
  //get saved tags
  if(localStorage.getItem("tags")=== null){
    originalTags =[];
  }else{
    originalTags = JSON.parse(localStorage.getItem("tags"));
  }

  //update the original tags
  let startPoint = originalTags.length;
  for(let i=0;i<tags.length;i++){
    originalTags.push([startPoint +i, tags[i]]);
  }

  //set to local storage
  localStorage.setItem("tags",JSON.stringify(originalTags));
}

//Remove tag
function removeTag(id){
  //modify from local storage
  tagList.children[id].remove();
  //remove tag from local storage
  removeTagFromLocalStorage(id);
}

//Remove tag from local storage
function removeTagFromLocalStorage(id){
  let tags;
  if(localStorage.getItem("tags")=== null){
    tags = [];
  }else{
    tags = JSON.parse(localStorage.getItem("tags"));
  }

  tags.splice(id,1);

  for(let i=0;i<tags.length;i++){
    tags[i][0] = i;
  }
  
  localStorage.setItem("tags",JSON.stringify(tags));

  getTags();
}

//Clear tags 
function clearTags(){
  while(tagList.firstChild){
    tagList.removeChild(tagList.firstChild);
  }
}

//Edit tags
function editTags(){
  let tags;
  if(localStorage.getItem("tags")=== null){
    tags = [];
  }else{
    tags = JSON.parse(localStorage.getItem("tags"));
  }

  let outList = [];
  for(let i=0;i<tags.length;i++){
    outList.push(String(tags[i][1]));
  }

  document.querySelector('#textarea').value = outList.join(';');
  
  //save tag
  editBtn.textContent = "Save";
  editBtn.removeEventListener("click",editTags);
  editBtn.addEventListener("click",saveTags);

  addBtn.style.display = "none";
  //addBtn.className = addBtn.className + " disabled";

}

//Save tags
function saveTags(){
  localStorage.clear();
  addTags();
  addBtn.style.display = "block";
  editBtn.textContent = "Edit";
  editBtn.removeEventListener("click",saveTags);
  editBtn.addEventListener("click",editTags);


}
