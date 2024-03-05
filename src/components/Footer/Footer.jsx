
import './Footer.css'
import { Box, Container, Grid, Typography } from '@mui/material';

const Footer = () => {
 
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "primary.main",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        color: "white"
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography>
              DEVELOPED BY - KALEAB SHUMET KEBEDE
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              {`${new Date().getFullYear()} | React | Material UI | JsPDF`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
  
}

export default Footer