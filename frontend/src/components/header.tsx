import LogoSvg from '../assets/logo.svg';

export function Header() {
  return (
    <header className="w-full flex justify-center">
      <img 
        src={LogoSvg} 
        alt="Financy Logo" 
        className="h-11 w-auto"
      />
    </header>
  );
}