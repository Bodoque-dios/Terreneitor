// components/SpotConfigPopover.js
import * as React from 'react';
import Popover from '@mui/material/Popover';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';
import { useState } from "react";
import { updateTime } from '@/app/lib/actions';
import { useFormState } from "react-dom";
import { useTranslation } from "react-i18next";
 
const PopoverContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  width: '20rem',
}));

const Grid = styled('div')({
  display: 'grid',
  gap: '16px',
});


const ButtonContainer = styled('div')({
  display: 'flex',
  gap: '8px',
});

export default function SpotConfigPopover({data}) {


  const { t } = useTranslation("common", {
		keyPrefix: "parking_configuration_view",
	});


  const [anchorEl, setAnchorEl] = useState(null);

  const [errorMessageVisit, dispatchUpdate] = useFormState(updateTime, undefined);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);


  const [selectedDate, setSelectedDate] = useState('');

	const handleDateChange = (event) => {
	  setSelectedDate(event.target.value);
	};

	
  const handleSave = (event) => {
    event.preventDefault();

    handleClose();

    updateTime(selectedDate, selectedTime,data)

    setTimeout(() => {
			//we reload the page to update the visitors list using plain js
			window.location.reload();
		}, 3000);


  };



	  //Now, to select the time use the following code
	  const [selectedTime, setSelectedTime] = useState('');

	  const handleTimeChange = (event) => {
		setSelectedTime(event.target.value);
	  };
	

  return (
    <div>
      <IconButton aria-label="Configure spot" onClick={handleClick} size="small">
        <SettingsIcon fontSize="small" />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
        }}
        transformOrigin={{
          vertical: 'top',
        }}
      >
        <PopoverContent>
          <Grid container spacing={2}> 
        <form onSubmit={handleSave}>
          
            <Grid item xs={12} style={{ marginBottom: '20px' }}>
              <Typography variant="h6">{t("title")}</Typography>
              <Typography variant="body2" color="textSecondary">
                {t("description")}
              </Typography>
            </Grid>

            <Grid item xs={12} style={{ marginBottom: '20px' }}>
              <TextField
                id="date"
                name="date"
                label="Select Date"
                type="date"
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} style={{ marginBottom: '20px' }}>
              <TextField
                id="time"
                name="time"
                label="Select Time"
                type="time"
                onChange={handleTimeChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonContainer>
                <Button variant="outlined" size="small" onClick={handleClose}>
                  {t("cancel")}
                </Button>
                <Button variant="contained" size="small" color="primary" type="submit">
                  {t("update")}
                </Button>
              </ButtonContainer>
            </Grid>
          </form>
          </Grid>
        </PopoverContent>
      </Popover>
    </div>
  );
}
