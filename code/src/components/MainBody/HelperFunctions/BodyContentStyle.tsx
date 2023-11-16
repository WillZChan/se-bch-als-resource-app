import { createStyles, rem } from '@mantine/core';



export const bodyContentUseStyles = createStyles((theme) => ({
  inner: {
    height: '57px',
    display: 'flex',
    width: '100%',
    // backgroundColor: 'transparent',
    color: '#254885',
    border: '2px solid #254885',
    borderRadius: rem(10),
    // width: rem(320),
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    cursor: 'pointer',


    [theme.fn.smallerThan('xs')]: {
      height: '57px',
      display: 'flex',
      // textAlign: 'center',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
      '&:hover': {
        backgroundColor: '#254885',  color: "#FFFFFF",
    },
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
    position: "absolute", 
    left: "2.02%", 
    top: "12.36%", 
    color: "#FFFFFF"
  },

  text: {
    fontWeight: 600,
    paddingTop: rem(12),
    width: '80%',
    fontSize: rem(20),
    fontStyle: 'normal',
    letterSpacing: rem(-1),
    color: '#254885',
    // marginBottom: theme.spacing.xs,
    textAlign: 'left',
    fontFamily: `Montserrat, ${theme.fontFamily}`,
    // lineHeight: rem(16),

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(20),
      textAlign: 'left',
      width: '80%'
    },
  },

  descriptionText: {
    fontSize: rem(16), // smaller font size than 'text'
    fontWeight: 'normal', // less bold than 'text'
    color: '#254885', // same color as 'text'
    paddingTop: rem(1), // add some space above the description
    fontStyle: 'normal',
    letterSpacing: rem(-0.5),
    textAlign: 'left',
    fontFamily: `Montserrat, ${theme.fontFamily}`,
    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(16),
      textAlign: 'left'
    },
  },


  outer: {
    paddingTop: rem(26),
    pddingBottom: '10%',
    
    paddingLeft: '10%',
    paddingRight: '10%',
  
  },
}));