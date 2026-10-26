import HomePageComponent from '../components/HomePageComponent'

interface HomeProps {
  name?: string;
  email?: string;
  avatar?: string;
} 

const Home = ({ name, email, avatar }: HomeProps) => {
  return (
    <div>
      <HomePageComponent name={name} email={email} avatar={avatar} />
    </div>
  )
}

export default Home
