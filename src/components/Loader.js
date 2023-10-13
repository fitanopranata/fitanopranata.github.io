import logo from '../images/spinner.svg';
import '../css/loader.css'
import { Oval } from 'react-loader-spinner';

function Loader({height}) {
  return (
    <div className="layout">
      <div className="background" style={{ background: 'rgba(0,0,0, 0)', height: height }}>
        <Oval height={80} width={80} color="#2C384AF2" secondaryColor="#9BA0A9" />
        <p style={{ color: '#2C384AF2', marginTop: '20px' }}>
          Please wait . . .
        </p>
      </div>
    </div>
  );
}

export default Loader;
