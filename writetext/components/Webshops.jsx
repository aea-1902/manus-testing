import React from 'react'
import Webshop from './Webshop'

export default function Webshops ({platform, webshops, onchange, verify, ondelete, isadmin, onTemplateChange = () => {}, templates = [], selectedTemplate = {}}){
  return (
    <>
        {webshops.map((webshop, index) => 
        (<Webshop key={webshop.id} index={index} onTemplateChange={onTemplateChange} platform={platform} webshop={webshop} onchange={onchange} verify={verify} ondelete={ondelete} isadmin={isadmin} templates={templates} selectedTemplate={selectedTemplate}/>))}
    </>
  )
}
