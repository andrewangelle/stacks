import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'remix';

import { signedInState, tokenState } from '~/store';
import { 
  Button, 
  Center, 
  ErrorMessageContainer, 
  FlexColumn, 
  InputLabel, 
  RegisterModalClose, 
  RegisterModalContent, 
  RegisterModalOverlay, 
  RegisterModalPortal, 
  RegisterModalRoot, 
  RegisterModalTrigger 
} from '~/styles';

export function RegisterModal(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [hasFormError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const [, setSignedIn] = useRecoilState(signedInState);
  const [, setToken] = useRecoilState(tokenState);
  const navigate = useNavigate(); 
  const [isSubmitted, setSubmitted] = useState(false); 
  
  async function register(){
    const res = await fetch('/resources/register', {
      body: JSON.stringify({
        email: username,
        password: password,
        firstName,
        lastName
      }),
      method: 'POST',
    })

    const result = await res.json();

    if(result.user.role === 'authenticated'){
      setSignedIn(true)
      setToken(result.session)
      navigate('/boards')
    }

   }

   useEffect(() => {
    if(
      password.length > 0 && 
      password !== confirmPassword
    ){
      setFormError(true)
      setErrorMessage('passwords must match')
    }

    if(password.length === 0){
      setFormError(true)
      setErrorMessage('password is required')   
    }

    if(firstName.length === 0){
      setFormError(true)
      setErrorMessage('first name is required')   
    }

    if(lastName.length === 0){
      setFormError(true)
      setErrorMessage('last name is required')   
    }

    if(username.length === 0){
      setFormError(true)
      setErrorMessage('email is required')   
    }

    if(hasFormError && errorMessage === 'passwords must match' && password === confirmPassword){
      setFormError(false)
    }

    if(hasFormError && errorMessage === 'first name is required' && firstName.length > 0){
      setFormError(false)
    }

    if(hasFormError && errorMessage === 'last name is required' && lastName.length > 0){
      setFormError(false)
    }

    if(hasFormError && errorMessage === 'email is required' && username.length > 0){
      setFormError(false)
    }

    if(hasFormError && errorMessage === 'password is required' && password.length > 0){
      setFormError(false)
    }
   }, [
     errorMessage, 
     password, 
     confirmPassword, 
     setFormError, 
     hasFormError, 
     firstName,
     lastName,
     username
    ])
  return (
    <RegisterModalRoot>
      <RegisterModalTrigger style={{border: 'none', background: 'transparent'}}>
        <Button secondary style={{padding: '8px 10px'}}>Register</Button>
      </RegisterModalTrigger>

      <RegisterModalPortal>
        <RegisterModalOverlay>
          <RegisterModalContent>
            <RegisterModalClose>X</RegisterModalClose>
            <Center>
              {isSubmitted && (
                <>Check your email for a confirmation link</> 
              )}
              {!isSubmitted && (
                <>
                  <FlexColumn>
                    <InputLabel htmlFor='email'>Email</InputLabel>
                    <input 
                      name='email' 
                      value={username}  
                      onChange={event => setUsername(event.target.value)}
                    />
                  </FlexColumn>

                  <FlexColumn>
                    <InputLabel htmlFor='firstName'>First Name</InputLabel>
                    <input 
                      name='firstName' 
                      value={firstName}  
                      onChange={event => setFirstName(event.target.value)}
                    />
                  </FlexColumn>

                  <FlexColumn>
                    <InputLabel htmlFor='lastName'>Last Name</InputLabel>
                    <input 
                      name='lastName' 
                      value={lastName}  
                      onChange={event => setLastName(event.target.value)}
                    />
                  </FlexColumn>

                  <FlexColumn>
                    <InputLabel htmlFor='password'>Password</InputLabel>
                    <input 
                      type='password'
                      name='password'
                      value={password}  
                      onChange={event => setPassword(event.target.value)}
                    />
                  </FlexColumn>

                  <FlexColumn>
                    <InputLabel htmlFor='confirmPassowrd'>Confirm Password</InputLabel>
                    <input 
                      type='password'
                      name='confirmPassword'
                      value={confirmPassword}  
                      onChange={event => setConfirmPassword(event.target.value)}
                    />
                  </FlexColumn>

                  {hasFormError && (
                    <FlexColumn>
                      <ErrorMessageContainer>
                        <Center>
                          {errorMessage}
                        </Center>
                      </ErrorMessageContainer>
                    </FlexColumn>
                  )}
                  <Button 
                    disabled={hasFormError}
                    onClick={() => register().then(() => setSubmitted(true))} 
                    style={{padding: '8px 10px'}}
                  >
                    Register
                  </Button>
                </>
              )}
            </Center>

          </RegisterModalContent>
        </RegisterModalOverlay>
      </RegisterModalPortal>
    </RegisterModalRoot>
  )
}