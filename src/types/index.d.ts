interface AuthState {
  isAuthenticated: Boolean;
  token: null | string;
  user: null | User;
}

interface ErrState {
  isError: Boolean;
  error: null | string;
  response: any;
}

interface User {
  id: string;
  email: string;
  username: string;
  fname: string;
  lname: string;
  contact: string;
  dob: string;
  gender: string;
  refer: string;
  relationship: string | null;
  location: string | null;
  city: string;
  country: string;
  country_code: string;
  nickname: string | null;
  designation: string | null;
  school: string | null;
  college: string | null;
  employer: string | null;
  bio: string | null;
  profile_img: string;
  image_color: string;
  cover_img: string;
  type: string;
  status: string;
  otp_status: string;
  reward_status: string;
  token: string;
  code: string;
  verified: string;
  date: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface MainNavigationProps {
  defaultRoute: string | undefined;
}

interface Friend {
  id: string;
  name: string;
  room_id: string;
  url: string;
  username: string;
}

interface RTCOffer {
  type: null;
  sdp: string;
}

interface CallOffer {
  offer: RTCOffer | unknown;
  type: string;
  receiver: string;
  sender: User | null;
  token: string;
}
