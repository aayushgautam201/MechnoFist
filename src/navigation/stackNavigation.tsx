import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

import LoginScreen from '../auth/login';
import SignUpScreen from '../auth/signup';
import ForgotPasswordScreen from '../auth/forgotPassword';
import HomeScreen from '../home/homeScreen';
import AppDrawerNavigator from './drawerNavigation';
import ProfileScreen from '../user/profileScreen';
import RewardPointsScreen from '../user/rewardPointScreen';
import PaymentMethodsScreen from '../user/paymentScreen';
import BookingMapScreen from '../booking/bookingScreen';
import BookingHistoryScreen from '../booking/userBookings';
import ScheduleScreen from '../booking/scheduleScreen';
import EmployeeDetailsScreen from '../employee/employeeDetailPage';
import NotificationsScreen from '../user/notification';
import JobDetailsScreen from '../user/jobDetailpage';
import EmployeesScreen from '../employee/employeeScreen';
import EmployeeBookingScreen from '../employee/employeeBookingScreen';
import BookingDetailScreen from '../booking/bookingDetailpage';
import ChatScreen from '../chat/chatScreen';
import HelpSupportScreen from '../user/helpandSupport';
import SettingsScreen from '../user/settingsScreen';



const Stack = createNativeStackNavigator();

const NavigationData = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
            initialRouteName='Login'
                screenOptions={{
                    headerShown: false,
                    animation: 'fade_from_bottom',
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Notification" component={NotificationsScreen} />
                <Stack.Screen name="Main" component={AppDrawerNavigator} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> 
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> 
                <Stack.Screen name="RewardPointScreen" component={RewardPointsScreen} /> 
                <Stack.Screen name="PaymentScreen" component={PaymentMethodsScreen} /> 
                <Stack.Screen name="BookingScreen" component={BookingMapScreen} /> 
                <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} /> 
                <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} /> 
                <Stack.Screen name="EmployeeDetailScreen" component={EmployeeDetailsScreen} /> 
                <Stack.Screen name="JobDetailScreen" component={JobDetailsScreen} /> 
                <Stack.Screen name="EmployeeScreen" component={EmployeesScreen} /> 
                <Stack.Screen name="EmployeeBookingScreen" component={EmployeeBookingScreen} /> 
                <Stack.Screen name="BookingDetailScreen" component={BookingDetailScreen} /> 
                <Stack.Screen name="ChatScreen" component={ChatScreen} /> 
                <Stack.Screen name="HelpSupport" component={HelpSupportScreen} /> 
                <Stack.Screen name="Settings" component={SettingsScreen} /> 



                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default NavigationData;