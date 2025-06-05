import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField } from '../components'

const BillingScreen = () => {
  return (

    <Box
      sx={{
        borderRadius: 4,
        p: 3,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        height: "100%"
      }}
    >
      <Grid container direction="row" spacing={1} padding={1}>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Make"} />
          </Grid>
          <Grid item flex={1}>
            <CustomDropDown options={[]} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Model"} />
          </Grid>
          <Grid item flex={1}>
            <CustomDropDown options={[]} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={1} padding={1}>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Product"} />
          </Grid>
          <Grid item flex={1}>
            <CustomDropDown options={[]} />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Code"} />
          </Grid>
          <Grid item flex={1}>
            <CustomDropDown options={[]} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container direction="row" spacing={1} padding={1}>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Amount"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextField/>
          </Grid>
        </Grid>

      </Grid>
    </Box>

  );
};

export default BillingScreen;
