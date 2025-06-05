import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, FormControlLabel, Checkbox } from "@mui/material";
import { CustomDropDown, CustomFormLabel, CustomTextField, CustomTextFieldWithSearch } from '../components'
import api from "../services/api";
import urls from "../services/urls";
import { useToast } from "../components/Popup/ToastProvider";
import { ItemPopup } from "../components";

const BillingScreen = () => {
  const { showToast } = useToast();
  const [isUniversalChecked, setIsUniversalChecked] = useState(false);
  const [categoryID, setCategoryID] = useState(0);
  const [categoryList, setCategoryList] = useState([]);
  const [newMakeList, setNewMakeList] = useState([]);
  const [makeID, setMakeID] = useState(0);
  const [open, setOpen] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemID, setItemID] = useState(0);
  const handleCheckboxChange = (event) => {
    setIsUniversalChecked(event.target.checked);
  };

  const handleSelect = (item) => {
    setItemName(item.ItemName)
    setItemID(item.ItemID);
    setOpen(false);
  }

  useEffect(() => {
    getCategoryList();
    fetchMakes();
  }, [])

  const getItems = async () => {
    try {
      const { data } = await api.get(`${urls.getAllItems}?itemName=${itemName}&categoryID=${categoryID}`)
      if (data.resultStatus == 'success') {
        setItemList(data.data);
        console.log("res",data)
        if(data.data.length==0){
          showToast("No Items Found","info");
        }
        else{
        setOpen(true)
        }
      }
    }
    catch (err) {

    }
  }


  const getCategoryList = async () => {
    try {
      const { data } = await api.get(`${urls.getCategories}?category=`)
      if (data.resultStatus == 'success') {
        const formattedDataForPopup = [...data.data.map(({ ID, Name }) => ({
          id: ID,
          description: Name
        }))]
        setCategoryList(formattedDataForPopup)
        setCategoryID(formattedDataForPopup[0].id)
      }
    }
    catch (err) {
    }
  }

  const fetchMakes = async () => {
    try {
      const { data } = await api.get(`${urls.getAllMakes}?make=`)
      if (data.resultStatus === 'success') {
        const formattedDataForNew = [
          ...data.data.map(({ MakeID, Make }) =>
          ({
            id: MakeID,
            description: Make
          }
          )
          )
        ]
        setMakeID(formattedDataForNew[0].id)
        setNewMakeList(formattedDataForNew)
      }
    }
    catch (err) {
      console.error(err)
    }
  };

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
            <CustomFormLabel text={"Barcode"} />
          </Grid>
          <Grid item flex={1}>
            <CustomTextFieldWithSearch />
          </Grid>
        </Grid>
        <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"} justifyContent={"flex-end"}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isUniversalChecked}
                onChange={handleCheckboxChange}
                name="singleCheckbox"
              />
            }
            label="Universal"
          />

        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Category"} />
          </Grid>
          <Grid item flex={1}>
            <CustomDropDown options={categoryList} value={categoryID} handleChange={(e) => setCategoryID(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container size={{ xs: 12, sm: 12, md: 6, lg: 6 }} alignItems={"center"}>
          <CustomFormLabel text={"Item"} />
          <Grid item flex={1}>
            <CustomTextField value={itemName}
              handleChange={(e) => setItemName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  getItems();
                }
              }}
            />
          </Grid>
        </Grid>
        <Grid container size={{ md: 6, lg: 6 }} alignItems={"center"}>
          <Grid item>
            <CustomFormLabel text={"Make"} />
          </Grid>
          <Grid item flex={1}>
            <CustomDropDown options={newMakeList} value={makeID} handleChange={(e) => setMakeID(e.target.value)} />
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
            <CustomTextField />
          </Grid>
        </Grid>

      </Grid>
      <ItemPopup
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        onSelect={handleSelect}
        items={itemList}
      />
    </Box>

  );
};

export default BillingScreen;
