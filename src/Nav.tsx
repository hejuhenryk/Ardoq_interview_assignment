import * as React from 'react'
import styled from 'styled-components'

import pin_1 from './icons/pin_1.png'
import pin_2 from './icons/pin_2.png'
import pin_3 from './icons/pin_3.png'

export type ButtonName = "All" | "Bikes" | "Slots"
type NavProps = {
  inUse: ButtonName;
  setInUse: (n: ButtonName) => void;
}
export const Nav: React.FC<NavProps> = ({ inUse, setInUse }) => {
  return <NavStyled>
    <div>
      <NavButton name="Bikes" isInUse={inUse === "Bikes"} handleClick={() => setInUse("Bikes")} />
      <NavButton name="Slots" isInUse={inUse === "Slots"} handleClick={() => setInUse("Slots")} />
      <NavButton name="All" isInUse={inUse === "All"} handleClick={() => setInUse("All")} />
    </div>
  </NavStyled>
}

const NavStyled = styled.nav`
    display: flex;
    justify-content: center;
    margin: .5rem 0;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 1rem;
    }
    `

type NavButtonProps = {
  name: ButtonName;
  isInUse: boolean;
  handleClick: () => void;
}
const NavButton: React.FC<NavButtonProps> = ({ name, isInUse, handleClick }) => <ButtonStyled onClick={handleClick} disabled={isInUse}>{name}<img alt={"pin"}src={name === "Bikes" ? pin_2 : name === "Slots" ? pin_3 : pin_1} /></ButtonStyled>

const ButtonStyled = styled.button`
display: flex;
justify-content: space-evenly;
align-items: center;
    width: 6rem;
    height: 2rem;
    margin: 0 .5rem;
    padding: 1.2rem 2rem;
    color: #fff;
    font-weight: bold;
    border-radius: 8px;
    border: 0;
    background: #61B0A5;
    outline: none;
    text-transform: uppercase;
    img {
      margin-left: .5rem;
    }
    &:disabled {
      border-radius: 12px;
      background: #770079;
    }
  `
