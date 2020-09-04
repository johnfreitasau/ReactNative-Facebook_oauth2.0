/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Fragment, useState, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

const App = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const getUserInfo = useCallback((token) => {
    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: token,
        parameters: {
          fields: {string: 'email, name'},
        },
      },
      (error, result) => {
        if (error) {
          console.log('getUserCallback Error', error);
        } else {
          setUser(result);
          setLoading(false);
        }
      },
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }, []);

  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {loading && <ActivityIndicator />}
          {user && (
            <Fragment>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </Fragment>
          )}
        </View>
        <LoginButton
          permissions={['public_profile', 'email']}
          onLoginFinished={async (error, result) => {
            if (error) {
              console.log('Auth error', error);
            } else if (result.isCancelled) {
              console.log('User cancelled Auth');
            } else {
              const accessData = await AccessToken.getCurrentAccessToken();
              setLoading(true);
              getUserInfo(accessData.accessToken);
            }
          }}
          onLogoutFinished={() => setUser({})}
        />
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 20,
  },
  userEmail: {
    fontWeight: 'normal',
    color: '#333',
    fontSize: 14,
  },
});

export default App;
