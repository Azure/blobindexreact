import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    image: {
      fontSize: 80
    },
    wrapper: {
      border: 'lightgrey solid 1px',
      margin: 10,
      padding: 20,
      position: 'relative',
      textAlign: 'center',
      textTransform: 'capitalize',
      width: 200,
    }
  });

export default function CategoryItem({ url, category }) {
    const classes = useStyles();

    return(
        <div className={classes.wrapper}>
            <span className={classes.image} role="img" aria-label={category}>
                <img src={url} width="160" />
            </span>
            <h3>
            {category}
            </h3>
        </div>
    )
  }