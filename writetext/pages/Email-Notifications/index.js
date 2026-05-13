import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Body from '../../components/Body'
import Content from '../../components/Content'

const AppSettings = require('../../settings/AppSetting').default
import { useDeleteDialog } from '../../components/ConfirmDeleteDialog'
import apiService from '../../services/ApiService'
import { MemberTypeEnum } from '../../enum/MemberType'
function TogglerSwitch(props) {
    let {params, toggler} = props
    const [isOn, setIsOn] = useState(params[0].enabledAt != null);
  
    const toggleSwitch = () => {
        const toggleStatus = !isOn
        setIsOn((prevState) => !prevState)
      
        toggler(params[0].userId, params[0].urlId, params[0].email, toggleStatus)
    };
  
    return (
      <div className="toggler-container">
        <div
          className={`switch ${isOn ? 'on' : ''}`}
          onClick={toggleSwitch}
        >
          <div className={`circle ${isOn ? 'on' : ''}`} />
        </div>
      </div>
    );
  };
 
    
function Rows(props)
{
    let {webshops, users, setWebShopUsers, suggestedUsers, loading} = props
    const [addingControl, setAddingControl] = useState(webshops.map((webshop) => ({ urlId: webshop.urlId, addMore: false })))
    const [emailValidControl, setEmailValidControl] = useState(webshops.map((webshop) => ({ urlId: webshop.urlId, valid: true })))
    const [emailExist, setEmailExist] = useState(webshops.map((webshop) => ({ urlId: webshop.urlId, exists: false })))
    const [suggestions, setSuggestions] = useState({})
    const [ongoingSave, setOngoingSave] = useState([])
    const suggestionsRef = useRef(null)
    const { DeleteDialogComponent, showDialog } = useDeleteDialog();
    const addRecipient = async (urlId) => {


        let firstName = document.getElementById(`firstName-${urlId}`)
        let lastName = document.getElementById(`lastName-${urlId}`)
        let email = document.getElementById(`emailAddress-${urlId}`)
        const userExistOnStore = users.filter(u => u.urlId == urlId && u.email == email.value).length > 0
        const newEmailValidControl = [...emailValidControl]
        const newUserExistControl = [...emailExist]

        if (firstName.value !== '')
            firstName.value = firstName.value.replace(/[^a-zA-Z0-9 ]/g, '')
        
        if (lastName.value !== '')
            lastName.value = lastName.value.replace(/[^a-zA-Z0-9 ]/g, '')

        if (email.value === "")
        {
            newEmailValidControl.find(emailValidControl => emailValidControl.urlId == urlId).valid = false
            newUserExistControl.find(emailExist => emailExist.urlId == urlId).exists = userExistOnStore
            setEmailValidControl(newEmailValidControl)
            return
        }
        if (userExistOnStore)
        {
            newEmailValidControl.find(emailValidControl => emailValidControl.urlId == urlId).valid = false
            newUserExistControl.find(emailExist => emailExist.urlId == urlId).exists = userExistOnStore
            setEmailValidControl(newEmailValidControl)
            return  
        }

        let validEmail = isValidEmail(email.value)
        if (!validEmail)
        {
            newEmailValidControl.find(emailValidControl => emailValidControl.urlId == urlId).valid = false
            newUserExistControl.find(emailExist => emailExist.urlId == urlId).exists = userExistOnStore
            setEmailValidControl(newEmailValidControl)
            return
        }
        else
        {
            
            newEmailValidControl.find(emailValidControl => emailValidControl.urlId == urlId).valid = true
            newUserExistControl.find(emailExist => emailExist.urlId == urlId).exists = false
            setEmailValidControl(newEmailValidControl)
        }
        
        setOngoingSave([...ongoingSave, urlId])
        let userExistRequest = await apiService.postWithFormData(`${AppSettings.API_URL}/NotificationRecipients/UserExist`, JSON.stringify({ 'Email': email.value, 'CompanyId': webshops[0].companyId}))
        let user = userExistRequest.data
        if (user == "" || user == null)
        { 
            await apiService.get(`${AppSettings.API_URL}/Token?email=${encodeURIComponent(email.value)}&firstName=${firstName.value}&lastName=${lastName.value}&createOnly=false&urlId=${urlId}`)
            userExistRequest = await apiService.postWithFormData(`${AppSettings.API_URL}/NotificationRecipients/UserExist`, JSON.stringify({ 'Email': email.value}))
            const addRecipientCommand = {UrlId: urlId, FirstName: firstName.value, LastName: lastName.value, Email: email.value, UserId: userExistRequest.data.userId}
            const request = await apiService.postWithFormData(`${AppSettings.API_URL}/NotificationRecipients`, JSON.stringify(addRecipientCommand))
            const newRecipient = {id: request.data.id, firstName: firstName.value, lastName: lastName.value, email: email.value, urlId: urlId, enabledAt: null}
            const newUsers = [...users]
            newUsers.push(newRecipient)
            setWebShopUsers(newUsers)
            
        }
        else
        {
            const addRecipientCommand = {UrlId: urlId, FirstName: firstName.value, LastName: lastName.value, Email: email.value, UserId: user[0].userId}
            const request = await apiService.postWithFormData(`${AppSettings.API_URL}/NotificationRecipients`, JSON.stringify(addRecipientCommand))
            const newRecipient = {id: request.data.id, firstName: firstName.value, lastName: lastName.value, email: email.value, urlId: urlId, enabledAt: null, role: 'Editor'}
            const newUsers = [...users]
            newUsers.push(newRecipient)
            setWebShopUsers(newUsers)
            
        }
       
        cancelAdding(urlId)

        // if (!request.data.existingUser)
        // {
        //     var createUserRequest = await apiService.get(`${AppSettings.API_URL}/Token?email=${email.value}&firstName=${firstName.value}&lastName=${lastName.value}&createOnly=false&urlId=${urlId}`)
        //     debugger
        // }
        firstName.value = ''
        lastName.value = ''
        email.value = ''
        setOngoingSave(ongoingSave.filter(r=>r != urlId))
    }
    //loop through webshops and check if it has users
    

    const addMore = (urlId) => {
        const newAddingControl = [...addingControl]
        newAddingControl.find(addingControl => addingControl.urlId == urlId).addMore = true
        setAddingControl(newAddingControl)
    }
    const cancelAdding = (urlId) => {

        if (emailValidControl.filter(r=>r.urlId === urlId)[0].valid == false)
            emailValidControl.filter(r=>r.urlId === urlId)[0].valid = true

        const newAddingControl = [...addingControl]
        newAddingControl.find(addingControl => addingControl.urlId == urlId).addMore = false
        setAddingControl(newAddingControl)
    }
    const deleteRecipient = async (id, urlId, email, user) => {
        // set all emailValidControl to true
        const newEmailValidControl = emailValidControl.map(r=>({...r, valid: true}))
        setEmailValidControl(newEmailValidControl)
        const result = await showDialog();
        if (result)
        {
            if (email)
            {
                const emailElement = document.getElementById(`emailAddress-${id}`)
                const userToRemove = users.find(user => user.email == email && user.urlId == urlId)
                const newUsers = users.filter(user => user !== userToRemove)
                setWebShopUsers(newUsers)
                const request = await apiService.delete(`${AppSettings.API_URL}/NotificationRecipients/${id}/${urlId}`)
            }
            else
            {
                const userToDelete = users.find(user => user.id == id)
                const newUsers = users.filter(user => user.id != id && user.urlId != urlId)
                setWebShopUsers(newUsers)
                const request = await apiService.delete(`${AppSettings.API_URL}/NotificationRecipients/${id}`)
                
                if (newUsers.filter(r=>r.urlId == urlId).length == 0)
                {
                    addMore(userToDelete.urlId)
                }
            }
        }
    }

    const turnOnNotification = async (id, urlId, email, status) => {
        if (email)
        {
            await apiService.put(`${AppSettings.API_URL}/NotificationRecipients/${id}/${urlId}/${status}`)
        }
        else
        {
            await apiService.put(`${AppSettings.API_URL}/NotificationRecipients/${id}/${status}`)
        }
    }
    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    const filterSuggestions = (value, field, storeId) => {
        if (storeId)
        {
            const existingStoreUsers = users.filter(user => user.urlId == storeId)

                if (value.length > 0) {
                    const filteredSuggestions = suggestedUsers.filter(item=>item[field].toLowerCase().includes(value.toLowerCase())).map(item => ({ ...item, storeId }));
                    //remove users from suggesterUsers that already exist in existingStoreUsers
                    const filteredSuggestionsWithStoreId = filteredSuggestions.filter(item => !existingStoreUsers.find(user => user[field] == item[field] && user.urlId == storeId));
                    setSuggestions(filteredSuggestionsWithStoreId);
    
                } else {
                    if (suggestions.length > 0)
                    {
                        const suggestionsWithStoreId = suggestedUsers.map(item => ({ ...item }));
                        setSuggestions(suggestionsWithStoreId);
                    }
                        // setSuggestions(...suggestions)
                }

        }
            
    }
    const handleInputChange = (e, field, storeId) => {
        const value = e.target.value
        if (emailValidControl.filter(r=>r.urlId === storeId)[0].valid == false)
            emailValidControl.filter(r=>r.urlId === storeId)[0].valid = true

        filterSuggestions(value, field, storeId)
    }

    const handleSuggestionClick = (field, guid, suggestion) => {
        let firstNameElement = document.getElementById(`firstName-${guid}`)
        let lastNameElement = document.getElementById(`lastName-${guid}`)
        let emailElement = document.getElementById(`emailAddress-${guid}`)

        firstNameElement.value = suggestion.firstName
        lastNameElement.value = suggestion.lastName
        emailElement.value = suggestion.email

        setSuggestions([])
    }
    const handleClickOutside = (event) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
            setSuggestions([])
        }
    }
      // Event handler for focus and change
    const handleFocus = (e, field) => {
        const value = e.target.value;
        filterSuggestions(value, field);
    }
    useEffect(() => {
        
       

        // Bind the event listener
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    useEffect(() => {
        const checkWebshops = () => {
            const newAddingControl = [...addingControl]
            webshops.forEach(webshop => {
                const existingUser = users.find(user => user.urlId == webshop.urlId)
                if (!existingUser) {
                    newAddingControl.find(addingControl => addingControl.urlId == webshop.urlId).addMore = true
                }
                else
                {
                    newAddingControl.find(addingControl => addingControl.urlId == webshop.urlId).addMore = false
                }
            })
            setAddingControl(newAddingControl)
        }
       // if (users.length > 0 && webshops.length > 0)
       checkWebshops()
    },[users])
    return (
        <>
      {DeleteDialogComponent}
            {
                webshops != null ?
                webshops.map((store, index) => (
                    <div className='store-users' key={index}>
                        <div><p className='store-name' key={index}>{store.domain}</p></div>
                        <div className='store-users-container'>
                            {
                                <>
                                { users.filter(user =>user.urlId == store.urlId && user.role == "Main Account").map((user, index) => 
                                    <>
                                        <div className="form-group d-flex bd-highlight">
                                                <div className="form-floating mr-10 w-100">
                                                    <input id={`firstName-${user.id}`} className="form-control" type="text" placeholder='First name' value={user.firstName} readOnly/>
                                                    <label htmlFor={`firstName-${user.id}`}>First name</label>
                                                </div>
                                                <div className="form-floating mr-10 w-100">
                                                    <input id={`lastName-${user.id}`} className="form-control" type="text" placeholder='Last name' value={user.lastName} readOnly/>
                                                    <label htmlFor={`lastName-${user.id}`}>Last name</label>
                                                </div>
                                                <div className="form-floating mr-10 w-100">
                                                    <input id={`emailAddress-${user.id}`} className="form-control" type="text" placeholder='Email' value={user.email} readOnly/>
                                                    <label htmlFor={`emailAddress-${user.id}`}>Email</label>
                                                </div>
                                                <div className='d-flex delete-icon-container'> 
                                                    <span  className='delete-icon m-auto' onClick={() => deleteRecipient(user.id, store.urlId, user.email, user)}><Image id={user.id} src='/images/remove.svg' width={12} height={12} alt='remove'></Image></span>
                                                </div>
                                        </div>
                                    </>)
                                }
                                {
                                    users.length > 0 ?
                                    users.filter(user => user.urlId == store.urlId && user.role != "Main Account").map((user, index) => (
                                        <>
                                            <div className="form-group d-flex bd-highlight">
                                            <div className="form-floating mr-10 w-100">
                                                <input id={`firstName-${user.id}`} className="form-control" type="text" placeholder='First name' value={user.firstName} readOnly/>
                                                <label htmlFor={`firstName-${user.id}`}>First name</label>
                                            </div>
                                            <div className="form-floating mr-10 w-100">
                                                <input id={`lastName-${user.id}`} className="form-control" type="text" placeholder='Last name' value={user.lastName} readOnly/>
                                                <label htmlFor={`lastName-${user.id}`}>Last name</label>
                                            </div>
                                            <div className="form-floating mr-10 w-100">
                                                <input id={`emailAddress-${user.id}`} className="form-control" type="text" placeholder='Email' value={user.email} readOnly/>
                                                <label htmlFor={`emailAddress-${user.id}`}>Email</label>
                                            </div>
                                            {!user.fromUrlRoles ?
                                            <div className='d-flex delete-icon-container'> 
                                                <span  className='delete-icon m-auto' onClick={() => deleteRecipient(user.id)}><Image id={user.id} src='/images/remove.svg' width={12} height={12} alt='remove'></Image></span>
                                            </div> :
                                            <div className='d-flex delete-icon-container'> 
                                                <span  className='delete-icon m-auto' onClick={() => deleteRecipient(user.id, store.urlId, user.email, user)}><Image id={user.id} src='/images/remove.svg' width={12} height={12} alt='remove'></Image></span>
                                            </div>
                                            }
                                        </div>
                                        </>
                                    ))
                                    : 
                                    loading &&
                                    <div className='d-flex'>
                                        <Image className='m-auto' src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={100} height={100} alt="loader"></Image>
                                    </div>
                                }
                                </>
                                
                            }
                            {!addingControl.filter(ctrl => ctrl.urlId == store.urlId)[0].addMore && 
                                <>
                                    <div className='d-flex'>
                                        <button className='mx-auto btn add-webshop ' onClick={() => addMore(store.urlId)}>
                                            <Image src="images/ico-add.svg" alt="Plus Icon" className="icon" width={10} height={10}/>
                                            <span className="text">Add more</span>
                                        </button>
                                    </div>
                                </>
                                }
                                {/* adding users section */}
                                <div>
                                
                                    {!loading && addingControl.filter(ctrl => ctrl.urlId == store.urlId)[0].addMore && 
                                    <>
                                        <div className="form-group d-flex bd-highlight">
                                            <div className="form-floating mr-10 w-100">
                                                <input 
                                                    id={`firstName-${store.urlId}`} 
                                                    className="form-control" 
                                                    type="text" 
                                                    placeholder='First name' 
                                                    onChange={(e) => handleInputChange(e, 'firstName', store.urlId)}
                                                    onFocus={(e) => handleFocus(e, 'firstName')}
                                                />
                                                <label htmlFor={`firstName-${store.urlId}`}>First name</label>
                                                
                                            </div>
                                            <div className="form-floating mr-10 w-100">
                                                <input id={`lastName-${store.urlId}`} 
                                                    className="form-control" type="text" 
                                                    placeholder='Last name' 
                                                    onChange={(e) => handleInputChange(e, 'lastName', store.urlId)} 
                                                    onFocus={(e) => handleFocus(e, 'lastName')}/>
                                                <label htmlFor={`lastName-${store.urlId}`}>Last name</label>
                                            </div>
                                            <div className="form-floating mr-10 w-100 req email">
                                                <input id={`emailAddress-${store.urlId}`} 
                                                    className={`form-control ${emailValidControl.filter(ctrl => ctrl.urlId == store.urlId)[0].valid ? '' : 'is-invalid'}`} 
                                                    type="text" 
                                                    placeholder='Email' 
                                                    onChange={(e) => handleInputChange(e, 'email', store.urlId)} 
                                                    onFocus={(e) => handleFocus(e, 'email')}
                                                    required
                                                    />
                                                <label htmlFor={`emailAddress-${store.urlId}`}>Email</label>
                                                <div className="invalid-feedback">
                                                    {document.getElementById(`emailAddress-${store.urlId}`) && document.getElementById(`emailAddress-${store.urlId}`).value === '' ? 
                                                        "Please enter an email address." : 
                                                        emailExist.filter(emailExist => emailExist.urlId == store.urlId)[0].exists ? 
                                                        "Email already exist." : 
                                                        "Please enter a valid email."
                                                    }
                                                </div>
                                            </div>
                                            <div className='mr-10'>
                                                <button id={`save_${store.urlId}`} className='btn btn-outline-primary btn-recipient-save font-14 h-45' onClick={() => addRecipient(store.urlId)} readOnly={ongoingSave.includes(store.urlId)}>Save</button>
                                            </div>
                                            <div className='d-flex delete-icon-container'> 
                                                <span  id={`cancel_${store.urlId}`} className='delete-icon m-auto'><Image id={`image_${store.urlId}`} src='/images/remove.svg' width={12} height={12} alt='remove' onClick={()=>cancelAdding(store.urlId)}></Image></span>
                                            </div>
                                        </div>
                                        {suggestions && suggestions.length > 0 && suggestions[0].storeId == store.urlId && (
                                        <div className='suggested-users' ref={suggestionsRef}>
                                            <ul>
                                                {suggestions.map((suggestion, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => handleSuggestionClick('firstName', store.urlId, suggestion)}
                                                    >
                                                        <span>
                                                            {`${suggestion.firstName?.trim()} ${suggestion.lastName?.trim()}, ${suggestion.email?.trim()}`}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        )}
                                    </>
                                    }
                                    
                                </div>
                        </div>
                    </div>
                    
                ))
                : <p></p>
                
            }
        </>
    )
}

export default function EmailNotifications({userData}) {

    const router = useRouter()
    const [webshops, setWebshops] = useState(null)
    const [webShopUsers, setWebShopUsers] = useState([])
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(true)


    // const sampleData = [
    //     { id: 1, lastName: 'Smith', firstName: 'John', email: 'john.smith@example.com', urlId: '87e86685-81cc-4c8d-9658-39f68520bf8f' },
    //     { id: 2,lastName: 'Doe', firstName: 'Jane', email: 'jane.doe@example.com', urlId: '87e86685-81cc-4c8d-9658-39f68520bf8f'  },
    //     { id: 3,lastName: 'Brown', firstName: 'Charlie', email: 'charlie.brown@example.com', urlId: '87e86685-81cc-4c8d-9658-39f68520bf8f' }
    // ];
    useEffect(() => {
        const getWebshops = async () => {
            const result = await apiService.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs?includeDeleted=false`)
            if (result.data.length > 0)
            {
                setWebshops(result.data)
            }
        }
        const getWebshopRecipients = async () => {
            const result = await apiService.get(`${AppSettings.API_URL}/NotificationRecipients`)
            if (result.data.recipients.length > 0)
                setWebShopUsers(result.data.recipients)

            if (result.data.suggestedusers.length > 0)
                setSuggestedUsers(result.data.suggestedusers)

            
            setLoadingUsers(false)
        }

        const init = async () => {
            await Promise.all([getWebshops(), getWebshopRecipients()])
        }
        init()
    },[])
    const isFreeTrial = () => {
        return userData.credit.membershipType == MemberTypeEnum.FREETRIAL;
    }
    const isFreeTrialEnded = () => {
        const freeTrialExpiration = new Date(userData.credit.subscriptionExpiration);
        const today = new Date();
        return userData.credit.membershipType == MemberTypeEnum.FREETRIAL && freeTrialExpiration <= today;
    }
    if (userData)
    return (
        <>
        <Body>
            <Content>
                <div className='container email-notifications'>
                    <div className="header">
                      <p className='mb-15'>Email notifications</p>
                    </div>
                    <div className="header">
                      <p className="notifications-info mb-30">Manage who gets updates from WriteText.ai. Add or remove email addresses to ensure the right people are notified and stay informed.</p>
                    </div>
                    {isFreeTrial() && isFreeTrialEnded() ?
                    <div className={`header-tos free-trial-banner`}>
                        <div>
                          <p className="banner-title">Your free trial has ended.</p>
                          <p className="banner-text mb-0" style={{maxWidth: "unset"}}>To continue using WriteText.ai, purchase a credit bundle under Starter for text generation features or subscribe to the Pro plan to unlock SEO and automation tools.</p>
                        </div>
                        <div className='ms-auto mt-auto'>
                          <button className="btn btn-primary" onClick={() => router.push('/premium')} style={{width: '190px'}}>Go to Plans & Credits</button>
                        </div>
                    </div>
                    :
                    <div>
                        {
                            webshops != null ?
                            <Rows webshops={webshops} users={webShopUsers} setWebShopUsers={setWebShopUsers} suggestedUsers={suggestedUsers} loading={loadingUsers}/>
                            :
                            <>
                                <div className='empty-webshop'></div>
                                <p className='empty-webshop-text'>Looks like you haven&apos;t connected a webshop yet. Link one by installing the corresponding add-on for your ecommerce platform.</p> 
                            
                                <div className='d-flex'>
                                        <input type="button" className="btn btn-primary center plugin" value="Go to Downloads" onClick={() => router.push("/downloads")}/>
                                </div>
                            </>
                        }
                    </div>
                    }
                </div>
            </Content>
        </Body>
        </>
    )
}
