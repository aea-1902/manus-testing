import React, { memo, useEffect, useState } from 'react'
import axios from 'axios'
import Body from '../../components/Body'
import Content from '../../components/Content'
import { setAuthHeader } from '../../utils/axiosHeader'
import {Storagekeys} from '../../settings/StorageKeys';
import AppSettings from '../../settings/AppSetting'
import ModalPrompt from '../../components/ModalPrompt'
function Selections(props){
  const {promptType, selections, modelChange, languageChange} = props

  return(
    <>
    <div className="form-floating mr-14">
      <select data-type={promptType} className="form-select" id={`model-${promptType}`} aria-label="Model selection" onChange={modelChange}>
        <option value="default">Default</option>
        {
          selections.models.map((m, index) => (
            <option key={index} value={m}>{m}</option>
          ))
        }
      </select>
      <label htmlFor="floatingSelect">Model</label>
    </div>
    <div className="form-floating">
        <select data-type={promptType} className='form-select' id={`language-${promptType}`} aria-label="Language selection" onChange={languageChange}>
          <option value={"default"}>Default</option>
          {
          selections.languages.map((l, index) => (
            <option key={index} value={l}>{l}</option>
          ))
        }
        </select>
        <label htmlFor='language'>Language</label>
    </div>
    </>
  )
} 
const StaticListComponent = React.memo(({ list , type }) => {
  return  <>
            {list != null && list.filter(r=>r.type == type).length > 0 &&
              list.filter(r=>r.type == type).map((p, index) => {
                return (
                  <li key={index}>{p.model == "default" ? "Default" : p.model}, {p.language == null ? "Default" : p.language}</li>
                )
              })
          }
          </>
});

StaticListComponent.displayName = 'StaticListComponent';
// function ToUpdateList(props){
//   const {list, type} = props
//   const ListComponent = memo(({list}) => {
//     return(
//       <>
//        {list != null && list.filter(r=>r.type == type).length > 0 &&
//           list.filter(r=>r.type == type).sort(() => 0.5 - Math.random()).slice(0,3).map((p, index) => {
//             return (
//               <li key={index}>{p.model}, {p.language}</li>
//             )
//           })
//       }
//       </>
//     )
//   })

//   ListComponent(list)
// }

function DynamicPromptForm({ index, promptData, savedDynamicPrompts, handlePromptChange, handlePromptNameChange, handleSavePrompt }) {
  return (
    <div className='form-group mb-14'>
      {/* <div className='d-flex mb-14'>
        <Selections
          promptType={`dynamic-${index}`}
          selections={modelsLanguages}
          modelChange={(e) => handleModelChange(e, index)}
          languageChange={(e) => handleLanguageChange(e, index)}
        />
      </div> */}
      <div className='d-flex'>
        <div className='w-100'>
          <div className='form-floating w-100 d-flex mb-14'>
            <input id={`dynamicPromptName-${index}`} type='text' className='form-control' placeholder='Prompt Name' onChange={(e) => handlePromptNameChange(e, index,promptData.key)} value={promptData.key} disabled={(savedDynamicPrompts.find(r=>r.key == promptData.key)) ? savedDynamicPrompts.find(r=>r.key == promptData.key).saved : false}></input>
            <label htmlFor={`dynamicPromptName-${index}`}>Prompt key</label>
          </div>
          <div className='form-floating mr-14 w-100 d-flex'>
            <textarea
              id={`dynamicPrompt-${index}`}
              className='form-control'
              placeholder='Dynamic Prompt'
              onChange={(e) => handlePromptChange(e, index, promptData.key)}
              value={promptData.value}
            ></textarea>
            <label htmlFor={`dynamicPrompt-${index}`}>Prompt</label>
            
          </div>
        </div>
        
        <div className='ml-20 mt-auto prompt-save-container'>
            <ul className='prompt-list-toupdate'>
              {/* Example Static Component Usage */}
              <StaticListComponent list={[]} type={`dynamic-${index}`} />
            </ul>
            <input type='button' className='btn btn-primary submit-button' value='Save changes' onClick={() => handleSavePrompt(index, promptData.key)} />
        </div>
      </div>
      
    </div>
  );
}

export default function PromptSetting({userData}) {
  const [prompts, setPrompts] = useState(null)
  const [selectedPrompts, setSelectedPrompts] = useState(null)
  const [promptUpdated, setPromptUpdated] = useState(null)
  const [modelsLanguages, setModelsLanguages] = useState(null)
  const [promptsNeedUpdate, setPromptsNeedUpdate] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [dynamicPrompts, setDynamicPrompts] = useState([])
  const [savedDynamicPrompts, setSavedDynamicPrompts] = useState([])
  const https = require("https");
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
    useEffect(() => {
      if (prompts != null && modelsLanguages != null && loaded == false)
      {
        let promptsToLoop = {...prompts}
        delete promptsToLoop.specificPrompts
        let promptsToUpdate = []
        for (let key in promptsToLoop) {
          for (let model in modelsLanguages.models)
          {
            for (let language in modelsLanguages.languages)
            {
              if (prompts.specificPrompts.filter(r=>r.type == key && r.model == model && r.language == language).length == 0)
              {
                promptsToUpdate.push({type: key, model: modelsLanguages.models[model], language: modelsLanguages.languages[language]})
              }
            }
          }
        }
        setPromptsNeedUpdate(promptsToUpdate)
        
        setLoaded(true)
      }
    },[prompts, modelsLanguages])
    useEffect(() => {
        async function getPrompts(){
            //const AppSettings = require('../../settings/AppSetting').default
            await axios.get(`${AppSettings.API_URL}/Admin/GetPrompts`,{ httpsAgent: httpsAgent  }).then(p => {
               //remove specificPrompts on p.data
               let _selectedPrompts ={...p.data}
               setPrompts(p.data)
               setDynamicPrompts(p.data.others)
               const resultArray = [];
                Object.entries(p.data.others).forEach(([key, value]) => {
                  resultArray.push({
                    key: key,
                    value: value,
                    saved: true // Add the new property
                  });
                });
                setSavedDynamicPrompts(resultArray)
               delete _selectedPrompts.specificPrompts
               setSelectedPrompts(_selectedPrompts)
            })
        }

        async function getModelsAndLanguages(){
          await axios.get(`${AppSettings.API_URL}/Admin/ModelsLanguages`,{ httpsAgent: httpsAgent  }).then(p => {
            setModelsLanguages(p.data)
            
          })

        }

        async function getUser() {
            const AuthenticationService = require('../../services/AuthenticationService').default
            try
            {
              await AuthenticationService.getUser().then(u => {
                if (u != null)
                {
                  setAuthHeader(u.access_token)
                  getPrompts()
                  getModelsAndLanguages()
                }
              })
            }
            catch(e){
            }
          }
       getUser()
    },[])
    async function HandlePromptChanges(e){
        e.preventDefault()
        const elementId = e.currentTarget.id
        const selectedModel = document.getElementById(`model-${elementId}`).value
        let selectedLanguage = document.getElementById(`language-${elementId}`).value
        
        let updatedPrompts = {...prompts}
        if (selectedModel === "default" && selectedLanguage === "default")
        { 
          updatedPrompts[elementId] = e.currentTarget.value
          setPrompts(updatedPrompts)
        }
        else
        {

          selectedLanguage == "default" ? selectedLanguage = null : selectedLanguage
          if (updatedPrompts.specificPrompts.filter(r=>r.model == selectedModel && r.language == selectedLanguage && r.type == elementId).length > 0)
          {
            updatedPrompts.specificPrompts.find(r=>r.model == selectedModel && r.language == selectedLanguage && r.type == elementId).prompt = e.currentTarget.value
          }
          else
          {
            updatedPrompts.specificPrompts.push({model:selectedModel, language:selectedLanguage, type:elementId, prompt:e.currentTarget.value})
          }
          setPrompts(updatedPrompts)
        }
        
        let promptsToUpdate = {...selectedPrompts}
        promptsToUpdate[elementId] = e.currentTarget.value
        setSelectedPrompts(promptsToUpdate)
    }
    async function handleSubmitOtherPrompts(index, key){
      
      let data = {}
      //check if dynamicPrompts.filter is a function
      if (typeof dynamicPrompts.filter === 'function')
      {
        const toUpdate = dynamicPrompts.filter(r=>r.index == index)[0]
        setPromptUpdated(toUpdate.key)
        data = {
          Others: { [toUpdate.key] : toUpdate.value}
        }
      }
      else
      {
        const toUpdate = key
        setPromptUpdated(toUpdate)
        data = {
          Others: { [key] : dynamicPrompts[key]}
        }
      }
      const dynamicPromptNameElement = document.getElementById(`dynamicPromptName-${savedDynamicPrompts.length}`)
      if (dynamicPromptNameElement)
        document.getElementById(`dynamicPromptName-${savedDynamicPrompts.length}`).disabled = true
    
      await axios({
        method: 'POST',
        url: `${AppSettings.API_URL}/Admin/SavePrompts`,
        data: data,
        headers: {"Content-Type": "application/json"},
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(p => {
         const { Modal } = require("bootstrap")
        const myModals = new Modal("#prompt");
        myModals.show()
      })
    }
    async function handleSubmit(e){
      const selectedModel = document.getElementById(`model-${e}`).value
      let selectedLanguage = document.getElementById(`language-${e}`).value
      const formData = new FormData()
      let promptType

      switch (e)
      {
        case 'excerpt':
          promptType = "Excerpt"
          break;
        case 'openGraphText':
          promptType = "Open graph text"
          break;
        case 'pageDescription':
          promptType = "Page description"
          break;
        case 'pageTitle':
          promptType = "Page title"
          break;
        case 'productDescription':
          promptType = "Product description"
          break;
        case 'referenceProduct':
          promptType = "Reference product"
          break;
        case 'rewriting':
          promptType = "Rewriting"
          break;
        case 'systemMessage':
          promptType = "System message"
          break;
        case 'imageAltText':
          promptType = "Image alt text"
          break;
        case 'categoryDescription':
          promptType = 'Category description'
          break;
        case 'categoryOpenGraphText':
          promptType = 'Category open graph text'
          break;
        case 'categoryPageDescription':
          promptType = 'Category page description'
          break;
        case 'categoryPageTitle':
          promptType = 'Category page title'
          break;
        case 'categoryRewriting':
          promptType = 'Category rewriting'
          break;
        case 'categorySystemMessage':
          promptType = 'Category system message'
          break;
        default:
          promptType = ""
          break;
      }

      setPromptUpdated(promptType)
      
      if (selectedModel == "default" && selectedLanguage == "default")
      {
        
        formData.append(e, document.getElementById(e).value)
              
      await axios({
        method: 'POST',
        url: `${AppSettings.API_URL}/Admin/SavePrompts`,
        data: formData,
        headers: {"Content-Type": "application/json"},
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }).then(p => {
         const { Modal } = require("bootstrap")
        const myModals = new Modal("#prompt");
        myModals.show()
      })
      }
      else
      {
        selectedLanguage = selectedLanguage == "default" ? null : selectedLanguage
        const promptToUpdate = prompts.specificPrompts.filter(r=>r.model == selectedModel && r.language == selectedLanguage && r.type == e)
        await axios.post(`${AppSettings.API_URL}/Admin/SavePrompts`, {specificPrompts: promptToUpdate}, { httpsAgent: httpsAgent  }).then(p => {
          
         const { Modal } = require("bootstrap")
         const myModals = new Modal("#prompt");
         myModals.show()
        })
      }


    }

    async function handleModelChange(e){
      const promptType = e.currentTarget.dataset.type
      let p = {...prompts}
      let s = {...selectedPrompts}
      let selectedModel = e.currentTarget.value
      let selectedLanguage = document.getElementById(`language-${promptType}`).value

      if (selectedModel === "default" && selectedLanguage === "default" )
      {
        const specificPrompt =  p[promptType]
        s[promptType] = specificPrompt == undefined ? "" : specificPrompt
      }
      else
      {
        selectedLanguage = selectedLanguage  == "default" ? null : selectedLanguage
        if (p.specificPrompts.filter(r=>r.model == selectedModel && r.language == selectedLanguage && r.type == promptType).length > 0)
        {
          const specificPrompt = p.specificPrompts.find(r=>r.model == selectedModel && r.language == selectedLanguage && r.type == promptType).prompt
          s[promptType] = specificPrompt
        }
        else
        {
          s[promptType] = ""
        }
      }
      
      setSelectedPrompts(s)
    }
    async function handleLanguageChange(e){
      const promptType = e.currentTarget.dataset.type
      let p = {...prompts}
      let s = {...selectedPrompts}
      let selectedLanguage = e.currentTarget.value
      let selectedModel = document.getElementById(`model-${promptType}`).value

      if (selectedModel === "default" && selectedLanguage === "default" )
      {
        const specificPrompt =  p[promptType]
        s[promptType] = specificPrompt == undefined ? "" : specificPrompt
      }
      else
      {
        selectedLanguage = selectedLanguage  == "default" ? null : selectedLanguage
        if (p.specificPrompts.filter(r=>r.model == selectedModel && r.language == selectedLanguage && r.type == promptType).length > 0)
        {
          const specificPrompt = p.specificPrompts.find(r=>r.model == selectedModel && r.language == selectedLanguage && r.type == promptType).prompt
          s[promptType] = specificPrompt
        }
        else
        {
          s[promptType] = ""
        }
      }
      
      setSelectedPrompts(s)
    }

    const handleAddPrompt = () => {
      const existingPrompts = {...dynamicPrompts}
      existingPrompts[''] = ''
      setDynamicPrompts(existingPrompts)
    }
  
    const handleDynamicPromptChange = (e, index, key) => {
      const newPrompts = {...dynamicPrompts}
      newPrompts[key] = e.target.value
       setDynamicPrompts(newPrompts)

    }

    const handleDynamicPromptNameChange = (e, index,key) => {
      const newKey = e.target.value
      const oldKey = key
      const newPrompts = {...dynamicPrompts}
      newPrompts[newKey] = newPrompts[oldKey]
      delete newPrompts[oldKey]
      setDynamicPrompts(newPrompts)
    }
    // const handleDynamicPromptChange = (e, index) => {
    //   clearTimeout(timeout);
    //   timeout = setTimeout(() => {
    //     const newPrompts = [...dynamicPrompts];
    //     newPrompts[index].prompt = e.target.value;
    //     setDynamicPrompts(newPrompts);
    //     debugger
    //   }, 1000);
    // };

    // const handleDynamicPromptNameChange = (e, index) => {
    //   clearTimeout(timeout);
    //   timeout = setTimeout(() => {
    //     const newPrompts = [...dynamicPrompts];
    //     newPrompts[index].promptKey = e.target.value;
    //     setDynamicPrompts(newPrompts);
    //     debugger
    //   }, 1000);
    // };

    if (userData && selectedPrompts)
  return (
    <>
    <ModalPrompt target="prompt" prompt={promptUpdated} ></ModalPrompt>
      <Body>
        <Content>
          <div>
            <div>
              <div className="header">
                <p>Prompt settings</p>
              </div>
            </div>
            <div>
              <div id='prompt-form'>
                <div className='form-group mb-14'>
                <div className='d-flex mb-14'>
                <Selections promptType="systemMessage" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='systemMessage' className='form-control' placeholder='System message' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.systemMessage}></textarea>
                    <label htmlFor='systemMessage'>System message</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                      <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="systemMessage" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('systemMessage')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                  <Selections promptType="pageTitle" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='pageTitle' className='form-control' placeholder='Page title' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.pageTitle}></textarea>
                    <label htmlFor='pageTitle'>Page title</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                      <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="pageTitle" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('pageTitle')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="pageDescription" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='pageDescription' className='form-control' placeholder='Page description' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.pageDescription}></textarea>
                    <label htmlFor='pageDescription'>Page description</label><div className="ml-20 mt-auto prompt-save-container">
                      <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="pageDescription" />
                      </ul>
                      <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('pageDescription')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="openGraphText" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='openGraphText' className='form-control' placeholder='Open graph text' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.openGraphText}></textarea>
                    <label htmlFor='openGraphText'>Open graph text</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="openGraphText" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('openGraphText')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="excerpt" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='excerpt' className='form-control' placeholder='Excerpt' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.excerpt}></textarea>
                    <label htmlFor='excerpt'>Excerpt</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="excerpt" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('excerpt')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="productDescription" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='productDescription' className='form-control' placeholder='Product description' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.productDescription}></textarea>
                    <label htmlFor='productDescription'>Product description</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="productDescription" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('productDescription')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="referenceProduct" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='referenceProduct' className='form-control' placeholder='Reference product' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.referenceProduct}></textarea>
                    <label htmlFor='referenceProduct'>Reference product</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="referenceProduct" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('referenceProduct')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="rewriting" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='rewriting' className='form-control' placeholder='Rewriting' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.rewriting}></textarea>
                    <label htmlFor='rewriting'>Rewriting</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="rewriting" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('rewriting')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="imageAltText" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='imageAltText' className='form-control' placeholder='Image alt text' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.imageAltText}></textarea>
                    <label htmlFor='imageAltText'>Image alt text</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="imageAltText" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('imageAltText')}/>
                    </div>
                  </div>
                </div>

                {/* new */}
                
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="categoryDescription" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='categoryDescription' className='form-control' placeholder='Category description' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.categoryDescription}></textarea>
                    <label htmlFor='categoryDescription'>Category description</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="categoryDescription" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('categoryDescription')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="categoryOpenGraphText" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='categoryOpenGraphText' className='form-control' placeholder='Category open graph text' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.categoryOpenGraphText}></textarea>
                    <label htmlFor='categoryOpenGraphText'>Category open graph text</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="categoryOpenGraphText" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('categoryOpenGraphText')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="categoryPageDescription" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='categoryPageDescription' className='form-control' placeholder='Category page description' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.categoryPageDescription}></textarea>
                    <label htmlFor='categoryPageDescription'>Category page description</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="categoryPageDescription" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('categoryPageDescription')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="categoryPageTitle" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='categoryPageTitle' className='form-control' placeholder='Category page title' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.categoryPageTitle}></textarea>
                    <label htmlFor='categoryPageTitle'>Category page title</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="categoryPageTitle" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('categoryPageTitle')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="categoryRewriting" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='categoryRewriting' className='form-control' placeholder='Category rewriting' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.categoryRewriting}></textarea>
                    <label htmlFor='categoryRewriting'>Category rewriting</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="categoryRewriting" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('categoryRewriting')}/>
                    </div>
                  </div>
                </div>
                <div className='form-group mb-14'>
                  <div className='d-flex mb-14'>
                    <Selections promptType="categorySystemMessage" selections={modelsLanguages} modelChange={handleModelChange} languageChange={handleLanguageChange} />
                  </div>
                  <div className='form-floating mr-14 w-100 d-flex'>
                    <textarea id='categorySystemMessage' className='form-control' placeholder='Category system message' onChange={e=>HandlePromptChanges(e)} value={selectedPrompts.categorySystemMessage}></textarea>
                    <label htmlFor='categorySystemMessage'>Category system message</label>
                    <div className="ml-20 mt-auto prompt-save-container">
                    <ul className='prompt-list-toupdate'>
                        <StaticListComponent list={prompts.specificPrompts} type="categorySystemMessage" />
                      </ul>
                        <input type="button" className="btn btn-primary submit-button" value="Save changes" onClick={e => handleSubmit('categorySystemMessage')}/>
                    </div>
                  </div>
                </div>
                
              <div className="header mt-40">
                <p>Dynamic prompts</p>
              </div>
                {/* Dynamic Prompt Forms */}
                {Object.keys(dynamicPrompts).length  > 0 && Object.entries(dynamicPrompts).map(([key, value], index) => (
                    <DynamicPromptForm
                      key={index}
                      index={index}
                      savedDynamicPrompts={savedDynamicPrompts}
                      promptData={{key:key, value:value}}
                      handlePromptChange={handleDynamicPromptChange}
                      handlePromptNameChange={handleDynamicPromptNameChange}
                      handleSavePrompt={handleSubmitOtherPrompts}
                    />
                  ))}
                  <button className='btn btn-primary submit-button w-100' onClick={handleAddPrompt}>Add Dynamic Prompt</button>
              </div>
            </div>
          </div>
        </Content>
      </Body>
    </>
  )
}

