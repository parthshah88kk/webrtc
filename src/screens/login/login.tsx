import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import { Formik, FormikHelpers } from 'formik';
import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { StackActions, useNavigation } from '@react-navigation/native';
import { get, isEmpty } from 'lodash';
import EncryptedStorage from 'react-native-encrypted-storage';
import loginApi from '../../apis/auth/login';
import { usePushNotification } from './usePushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email field is required'),
  password: Yup.string().min(6).required('Password field is required'),
});

function Sample() {
  const navigate = useNavigation();
  const [error, setError] = useState<string | null>(null);
  const { requestNotificationPermission } = usePushNotification();

  const setUserToken = async (token: string, user: object, name: string) => {
    if (isEmpty(token)) {
      return;
    }
    try {
      await EncryptedStorage.setItem('user_token', token);
      await EncryptedStorage.setItem('user_info', JSON.stringify(user));
      await EncryptedStorage.setItem('user_name', name);
      console.log("Nikhil logs", name);

    } catch (err) {
      console.log(err);
    }
  };

  const getAuth = async () => {
    try {
      const token = await EncryptedStorage.getItem('user_token');
      const info = await EncryptedStorage.getItem('user_info');
      if (!isEmpty(token) && !isEmpty(info) && info) {
        const user = JSON.parse(info);
        //dispatch(authenticate({token: user.token, user: user}));
        navigate.dispatch(StackActions.replace('Home', { user: '' }));
      }
    } catch (err) {
      console.log(err);
      await EncryptedStorage.removeItem('user_token');
    }
  };

  useLayoutEffect(() => {
    getAuth();
  }, []);

  const userLogin = async (data: FormData) => {
    const response = await loginApi(data);
    console.log("responsess1111", response?.data?.data);

    await setUserToken(
      get(response, 'data.data.token', ''),
      get(response, 'data.data', {}),
      get(response, 'data.data.username', {}),
    );

    return response?.data;
  };

  const login = async (email: string, password: string) => {
    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    userLogin(formData)
      .then(data => {
        navigate.dispatch(StackActions.replace('Home', { user: data.data }));
        console.log('__userData___', data.data);
        requestNotificationPermission(data.data.id);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onSubmit = async (
    values: LoginFormData,
    { setSubmitting }: FormikHelpers<LoginFormData>,
  ) => {
    setSubmitting(true);
    await login(values.email.trim(), values.password.trim());
    // setSubmitting(false);
  };

  return (
    <Layout style={styles.container}>
      <Text style={styles.appTitle} category="h4">
        Meet App
      </Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isSubmitting,
        }) => (
          <>
            <Input
              placeholder="Enter Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.textInput}
              status={errors.email ? 'danger' : 'info'}
            />
            {errors.email ? (
              <Text category="c1" appearance="hint" status="danger">
                {errors.email}
              </Text>
            ) : null}
            <Input
              secureTextEntry={true}
              placeholder="Enter Password"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              style={styles.textInput}
              status={errors.password ? 'danger' : 'info'}
            />
            {errors.password ? (
              <Text category="c1" appearance="hint" status="danger">
                {errors.password}
              </Text>
            ) : null}
            {error ? (
              <Text
                category="label"
                appearance="hint"
                status="danger"
                style={styles.errorText}>
                {error}
              </Text>
            ) : null}
            <Button
              onPress={handleSubmit}
              size="medium"
              status="info"
              style={styles.actionButton}>
              {!isSubmitting ? (
                'LOGIN'
              ) : (
                <View>
                  <Spinner size="tiny" status="control" />
                </View>
              )}
            </Button>
            <Button
              onPress={handleSubmit}
              size="small"
              status="info"
              appearance="ghost"
              style={styles.registerButton}>
              New here? Register now
            </Button>
          </>
        )}
      </Formik>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: {
    marginBottom: 40,
  },
  textInput: {
    marginTop: 15,
    // borderColor: 'grey',
    borderRadius: 50,
  },
  actionButton: {
    width: 200,
    marginTop: 15,
    borderRadius: 50,
  },
  registerButton: {
    marginVertical: 20,
  },
  errorText: {
    textTransform: 'capitalize',
    marginTop: 5,
  },
});

export default Sample;
