import {
  VStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  LinkBox,
  Button,
  FormControl,
  Text,
  useToast,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../providers/auth/AuthProvider'

const ChangePage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)

  // React hook form
  const {
    register,
    handleSubmit,
    formState: {  errors, isSubmitting },
  } = useForm<ChangeData>()

  const toast = useToast()
  const router = useRouter()
  const { changePassword } = useAuth()

  const onSubmit = async (data: ChangeData) => {
    await changePassword(data)
      .then(() => {
        toast({
          title: 'Success',
          description: 'You have almost changed password! 2FA required',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })

        // Redirect to home page
        router.push('/two-factor');
      })
      .catch(err => {
        toast({
          title: 'Authentication error',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      })
  }

  return (
    <VStack spacing={4} align="stretch" maxW="sm" mx="auto" mt={8}>
      <Heading id="password-change" as="h1" size="2xl">
        Change your password
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.email}>
          <Input
            id="email-input"
            placeholder="Email"
            {...register('email', {
              required: true,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'invalid email address',
              },
            })}
          />
        </FormControl>

        {/* Show error  */}
        {errors.email && (
          <Text fontSize="sm" color="red.500">
            {errors.email.message}
          </Text>
        )}

        <FormControl mt={4} isInvalid={!!errors.current}>
          <InputGroup>
            <Input
              id='current-password-input'
              type={showPassword ? 'text' : 'password'}
              placeholder="Current password"
              {...register('current', {
                required: true,
              })}
            />
            <InputRightElement>
              <IconButton
                aria-label="Show password"
                icon={showPassword ? <FiEyeOff /> : <FiEye />}
                onClick={() => setShowPassword(!showPassword)}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl mt={4} isInvalid={!!errors.updated}>
          <InputGroup>
            <Input
              id='new-password-input'
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New password"
              {...register('updated', {
                required: true,
              })}
            />
            <InputRightElement>
              <IconButton
                aria-label="Show password"
                icon={showNewPassword ? <FiEyeOff /> : <FiEye />}
                onClick={() => setShowNewPassword(!showNewPassword)}
                variant="ghost"
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button id="change-btn" type="submit" mt={4} isLoading={isSubmitting}>
          Change password
        </Button>
      </form>
      <LinkBox>
        <Link href="/login">Remember your password? Login</Link>
      </LinkBox>
    </VStack>
  )
}

export default ChangePage
