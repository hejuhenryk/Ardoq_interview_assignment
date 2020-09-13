import * as React from 'react'
import styled, { keyframes } from 'styled-components'

import pin_1 from './icons/pin_1.png'
import pin_2 from './icons/pin_2.png'
import pin_3 from './icons/pin_3.png'
import dark from './icons/dark.png'
import light from './icons/light.png'
import reload from './icons/reload.png'
import { Theme } from './theme'

export type ButtonName = "All" | "Bikes" | "Slots"
type NavProps = {
  inUse: ButtonName;
  theme: Theme;
  toogleTheme: ()=>void;
  isLoading: boolean;
  setInUse: (n: ButtonName) => void;
  onReload: ()=>void;
}
export const Nav: React.FC<NavProps> = ({ inUse, setInUse, onReload, isLoading, theme, toogleTheme }) => {
  return <NavStyled>
    <RealodButton onReload={onReload} isLoading={isLoading} />
    <div>
      <NavButton name="Bikes" isInUse={inUse === "Bikes"} handleClick={() => setInUse("Bikes")} />
      <NavButton name="Slots" isInUse={inUse === "Slots"} handleClick={() => setInUse("Slots")} />
      <NavButton name="All" isInUse={inUse === "All"} handleClick={() => setInUse("All")} />
    </div>
    <ModeToogle theme={theme} onClick={toogleTheme} />
  </NavStyled>
}

const NavStyled = styled.nav`
    display: flex;
    justify-content: space-between;
    margin: .5rem 0;
    @media (max-width: 470px) {
      justify-content: center;
    }
    div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `

type NavButtonProps = {
  name: ButtonName;
  isInUse: boolean;
  handleClick: () => void;
}
const NavButton: React.FC<NavButtonProps> = ({ name, isInUse, handleClick }) => <ButtonStyled  onClick={handleClick} disabled={isInUse}>
  {name}
  <img alt={"pin"}src={name === "Bikes" ? pin_2 : name === "Slots" ? pin_3 : pin_1} />
</ButtonStyled>


const ButtonStyled = styled.button`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 5.5rem;
  height: 2rem;
  margin: 0 .5rem;
  padding: 1.2rem 2rem;
  color: #fff;
  font-weight: bold;
  border-radius: 8px;
  border: 1px transparent solid;
  background: #61B0A5;
  outline: none;
  text-transform: uppercase;
  img {
    margin-left: .5rem;
  }
  &:hover {
    border: 1px black solid;
  }
  &:disabled {
    background: #770079;
    border: 1px transparent solid;
  }
  `
const RealodButton: React.FC<{onReload: ()=>void; isLoading: boolean}> = ({onReload, isLoading}) => <ReloadButtonStyled onClick={onReload} isLoading={isLoading}><img alt="reload" src={reload} /></ReloadButtonStyled>

const spin = keyframes`
  from {
      transform: rotate(0deg);
  }
  to {
      transform: rotate(359deg);
  }
`

const ReloadButtonStyled = styled(ButtonStyled)<{isLoading: boolean}>`
  width: 1rem;
  @media (max-width: 470px) {
    position: absolute;
    top: -300%;
  }
  img {
    height: 1.2rem;
    margin: 0;
    animation: ${spin} ${p=>p.isLoading ? "1s" : "0"} linear infinite;
  }
`

const ModeToogle: React.FC<{theme: Theme; onClick: ()=>void}> = ({theme, onClick}) => {

  return <ToogleStyled onClick={onClick} t={theme}>
    <img src={dark} alt='dark moon' className='dark' />
    <img src={light} alt='light sun' className='light' />

  </ToogleStyled>
}

const ToogleStyled = styled(ButtonStyled)<{t: Theme}>`
  position: relative;
  overflow: hidden;
  height: 2rem;
  width: .8rem;
  background: #cccccc;
  @media (max-width: 470px) {
    position: absolute;
    top: -300%;
  }
  img {
    height: 2rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s ease-in-out;
    margin: 0;
    &.dark {
      top: ${p=>p.t === 'light' ? '50%' : '200%'};
    }
    &.light {
      top: ${p=>p.t === 'light' ? '-100%' : '50%'};
    }
  }
`