import { useContext, useState } from "react";

import Dropdown from "./Dropdown.jsx";
import TextArea from "./TextArea.jsx";
import { LangContext } from "./translationContext.jsx";
import { submitTranslationRequest } from "../http.js";

import switchIcon from "../assets/switch_icon.svg";
import copyIcon from "../assets/copy_icon.svg";
import actionIcon from "../assets/action_icon.svg";

import { briefNameMapping } from "../data/languageMapping.js";


export default function MainInterface({addTranslation}){
  
  const [ sourceLang, setSourceLang ] = useState("unavailable"); 
  const { translationForm, 
          handleSwapLangs, 
          handleSourceTextUpdate, 
          handleResultTextUpdate,} = useContext(LangContext);


  async function submitRequest(){
    if (translationForm.text.length === 0){
      return;
    }
    handleResultTextUpdate("Translating...");

    try {
      
      const result = await submitTranslationRequest(translationForm);
      handleResultTextUpdate(result[0].text);
      setSourceLang(briefNameMapping[result[0].detected_source_language]);

      const newTransRecord = {...translationForm, source_lang: result[0].detected_source_language, result: result[0].text};
      const newTransId = Math.random().toFixed(6);
      addTranslation(newTransId, newTransRecord);
      
    } catch (error) {

      console.error("Translation failed:", error);
      handleResultTextUpdate("Translation failed, please check your API or internet connection");
    
    }
  }

  function copyToClipboard(){
    if (translationForm.result){
      navigator.clipboard.writeText(translationForm.result);
    }
  }


  return (
    <div 
      className="w-[70%] h-full pl-8 pr-12 py-uniform_y bg-zinc-200"
    >
      {/*Section of Dropdown menus*/}
      <section
        id="languages"
        className="flex content-center justify-between"
      >
        <div>
          <Dropdown label="Source"/>
        </div>
        <button 
          className="focus:outline-none"
          onClick={handleSwapLangs}
        >
          <img 
            className="w-5"
            src={switchIcon} 
            alt="switch icon"/>
        </button>
        <div>
          <Dropdown label="Target"/>
        </div>
      </section>

      {/*Section of text areas*/}
      <section id="source">
        <TextArea 
          title="Source Text"
          buttonIcon={actionIcon}
          styles="h-28"
          placeholder="Type or paste text here"
          onChange={() => handleSourceTextUpdate(event)}
          onButtonClick={() => submitRequest()}
        />
      </section>

      <section id="result">
        <TextArea 
          title="Result"
          buttonIcon={copyIcon}
          styles="h-56 bg-zinc-100"
          readOnly={true}
          value={translationForm.result}
          onButtonClick={() => copyToClipboard()}
        >
          <p className="text-sm text-zinc-400 font-light py-1">
            Language detected: <span className="italic">{sourceLang}</span>
          </p>
        </TextArea>
      </section>
    </div>
  )
}
