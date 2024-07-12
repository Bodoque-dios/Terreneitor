"use client"; // This is necessary for client-side components in Next.js 13+

import React, { useState } from "react";
import Link from "next/link";
import { Box, Container, Grid, Typography, List, ListItem, TextField, Button, Autocomplete, Card, CardHeader, CardContent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { createFilterOptions } from "@mui/material/Autocomplete";
import PropTypes from 'prop-types';
import { string } from "zod";
import { sql } from '@vercel/postgres';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { addPackage } from "@/app/lib/actions";



const filter = createFilterOptions();

export const Deliverycomponent = ({ residentName = [],}) => {
  const { t } = useTranslation("common", { keyPrefix: "deliverys" });

  const [selectedResident, setSelectedResident] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [residentAddress, setResidentAddress] = useState("");
  const [resident, setResident] = useState({
    user_id: "",
    firstname: "",
    lastname: "",
    residence_id: "",
    community_address: "",
    cellphone: "",
  });
  
  const handleNameChange = (event, value) => {
    if (value) {
      setSelectedResident(value);
      setResidentAddress(value.address);
      setResident({
        user_id: value.id,
        firstname: value.label.split(' ')[0],
        lastname: value.label.split(' ')[1],
        residence_id: value.residence_id,
        community_address: value.address,
        cellphone: value.cellphone,
      });
    } else {
      setSelectedResident(null);
      setResidentAddress("");
      setResident({
        user_id: "",
        firstname: "",
        lastname: "",
        residence_id: "",
        community_address: "",
        cellphone: "",
      });
    }
    setOpenAddress(value?.length > 0);
  };

  const handleAddPackage = async () => {
    const sender = "Amazon"; // Example sender
    const description = "Package from Amazon"; // Example description
    await addPackage(resident, sender, description);
  };
  
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box component="main" flex="1" py={12} px={6}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid item lg={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t("title")}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {t("general_info")}
              </Typography>
              <List>
                <ListItem>
                  <Box>
                    <Typography variant="h6">{t("front_desk")}</Typography>
                    <Typography variant="body1">
                      {t("front_desk_info")}
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box>
                    <Typography variant="h6">{t("resident_notification")}</Typography>
                    <Typography variant="body1">
                      {t("resident_notification_info")}
                    </Typography>
                  </Box>
                </ListItem>
                <ListItem>
                  <Box>
                    <Typography variant="h6">{t("pickup")}</Typography>
                    <Typography variant="body1">
                      {t("pickup_info")}
                    </Typography>
                  </Box>
                </ListItem>
              </List>
            </Grid>
            <Grid item lg={6}>
              <Typography variant="h4" component="h2" gutterBottom>
                {t("notification")}
              </Typography>
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {t("notification_info")}
              </Typography>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                 <Autocomplete
                   id="name"
                   name="residentName"
                   sx={{ mt: 2, width: 1 }}
                   disablePortal
                   freeSolo
                   forcePopupIcon={false}
                   noOptionsText="No options"
                   options={residentName}
                   renderInput={(params) => (
                      <TextField
                       {...params}
                       label={t("name_instruction")}
                       inputProps={{ ...params.inputProps, name: "residentName" }}
                       id="name"
                       placeholder= {t("owner_name")}
                       InputLabelProps={{ color: "secondary" }}
                       fullWidth
                     />
                  )}
                   renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.label}
                      </li>
                  )}
                   onInputChange={(event, value) => {
                      setOpenAddress(value?.length > 0);
                  
                   }}
                   onChange={handleNameChange}
                   filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      return filtered;
                  
                   }}
                 />
                 <Autocomplete
                    id="apartment"
                    name="residentapartment"
                    sx={{ mt: 2, width: 1 }}
                    disablePortal
                    freeSolo
                    forcePopupIcon={false}
                    noOptionsText="No options"
                    value={residentAddress}
                    open={openAddress}
                    onClose={() => setOpenAddress(false)}
                    options={residentName}
                    renderInput={(params) => (
                       <TextField
                        {...params}
                        label={t("apartment_instruction")}
                        inputProps={{ ...params.inputProps, name: "residentApartment" }}
                        id="apartment"
                        placeholder= {t("owner_apartment")}
                        InputLabelProps={{ color: "secondary" }}
                        fullWidth
                      />
            
                    )}
                    renderOption={() => null}
                    onInputChange={(event, value) => {
                       setOpenAddress(value?.length > 0);
            
                    }}
                    onChange={(event, value) => {
                       if (value) {
                         setResidentAddress(value.inputValue ?? value.address);
            
                      } else {
                         setResidentAddress("");
            
                      }
                      setOpenAddress(false);
                    }}
                    filterOptions={(options, params) => {
                       const filtered = filter(options, params);
                      return filtered;
            
                    }}
                />
                <Button 
                   type = "submit"
                  variant="contained" 
                  fullWidth 
                  onClick={handleAddPackage}
                >
                  {t("button")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component="footer" py={6} bgcolor="gray.900">
        <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="inherit">
            &copy; 2024 Terreneitor. All rights reserved.
          </Typography>
          <nav>
            <List sx={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
              <ListItem sx={{ width: 'auto' }}>
                <Link href="#" prefetch={false} passHref>
                  <Typography variant="body2" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Privacy Policy
                  </Typography>
                </Link>
              </ListItem>
              <ListItem sx={{ width: 'auto' }}>
                <Link href="#" prefetch={false} passHref>
                  <Typography variant="body2" color="inherit" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    Terms of Service
                  </Typography>
                </Link>
              </ListItem>
            </List>
          </nav>
        </Container>
      </Box>
    </Box>
  );
};

export function ResidentDeliveryComponent({	pendingPackages,user})
{
  const { t } = useTranslation("common", {
		keyPrefix: "resident_delivery",
	});
  return(
    
    <Container component="main" style={{ flex: 1, padding: "16px" }}>
    <div style={{ textAlign: "center", marginBottom: "32px" }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
      {t("welcome")} {user}!
      </Typography>
      <Typography variant="body1" color="secondary">
      {t("subtitle")}
      </Typography>
    </div> 
    {pendingPackages.length === 0 ? (
  <Typography variant="body2" color="textSecondary">
    {t("no_packages")}
  </Typography>
) : (
  <Grid container spacing={2}>
    {pendingPackages.map((packageitem) => (
      <Grid item xs={12} sm={6} md={4} key={packageitem.id}>
        <Card>
          <CardHeader title={t("pending_packages")} />
          <CardContent
            sx={{
              minHeight: "22vh",
              maxHeight: "50vh",
            }}
          >
            <PackageItem data={packageitem} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
)}   
      </Container>
  )
}
function PackageItem({ data }) {
	const { t } = useTranslation("translate-dashboard", {
		keyPrefix: "concierge",
	});
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				marginBottom: "8px",
			}}
		>
			<LocalShippingIcon style={{ marginRight: "8px" }} />
			<div>
				<Typography variant="body1">
					{t("package_for")} {data.recipient}
				</Typography>
				<Typography variant="body2" color="textSecondary">
					{t("sent_by")} {data.sender}
				</Typography>
				<Typography variant="body2" color="textSecondary">
					{t("arrived_on")} {data.drop_off}
				</Typography>
			</div>
		</div>
	);
}
Deliverycomponent.propTypes = {
  residentName: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ),
};


