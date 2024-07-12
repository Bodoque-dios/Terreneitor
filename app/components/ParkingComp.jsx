"use client";
import { useState } from "react";
import {
	Button,
	Autocomplete,
	TextField,
	Typography,
	Modal,
	Box,
	Alert,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useTranslation } from "react-i18next";
import QrReader from "@/app/components/QrReader";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useFormState } from "react-dom";
import { addVisitor, addVisitorVehicle, addParkingVisit } from "@/app/lib/actions";


const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "70vh",
	height: "70vh",
	bgcolor: "background.paper",
	borderRadius: 5,
	boxShadow: 24,
	p: 4,
};
function success() {
	alert("success!");
}
const filter = createFilterOptions();

export const ParkingComp = ({
	visitorsRut,
	visitorsName,
	residences,
	visitorLicense,
	frequentVisitors,
	availableParkingSpaces,
}) => {
    const { t } = useTranslation("common", {
		keyPrefix: "new_visitor_parking",
	});

	//Autocomplete values
	const [rut, setRut] = useState("");
	const [name, setName] = useState("");
	//autocomplete States
	const [openRut, setOpenRut] = useState(false);
	const [openName, setOpenName] = useState(false);
	// New visitor states
	const [newVisitorModal, setNewVisitorModal] = useState(false);
	const closeNewVisitorModal = () => setNewVisitorModal(false);
	// Data to add a non registered visitor
	const [newVisitor, setNewVisitor] = useState({
		firstName: "",
		lastName: "",
		rut: "",
	});
	const [license, setLicense] = useState("");
	const [visitorVehicle, setVisitorVehicle] = useState();
	//Visitor Modal state
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	//License Modal state
	const [openLicenseModal, setOpenLicenseModal] = useState(false);
	const handleCloseLicense = () => {
		setLicense(visitorVehicle.license_plate);
		setOpenLicenseModal(false);
	};
	//state for the selected parking space
	const [selectedParkingSpace, setSelectedParkingSpace] = useState("");
	//Frequewnt Visitor state
	const [frequentVisitor, setFrequentVisitor] = useState(false);
	//form handlers
	const [errorMessage, dispatch] = useFormState(addVisitor, undefined);
	const [errorMessageVehicle, dispatchVehicle] = useFormState(
		addVisitorVehicle,
		undefined,
	);
	const [errorMessageVisit, dispatchVisit] = useFormState(addParkingVisit, undefined);


	const handleSubmitVisitor = () => {
		setTimeout(() => {
			//we reload the page to update the visitors list using plain js
			window.location.reload();
		}, 3000);
	};

	const handleSelectParkingSpace = (event) => {
		const value = event.target.value;
		if (selectedParkingSpace == value) {
			setSelectedParkingSpace("");
			return;
		}
		setSelectedParkingSpace(value);
	};


	//To select the date use the following code
	const [selectedDate, setSelectedDate] = useState('');

	const handleDateChange = (event) => {
	  setSelectedDate(event.target.value);
	};

	
	  const handleSave = () => {
		// Simulate saving the date (e.g., sending it to a server)
		console.log('Saved Date:', selectedDate);
		alert(`Saved Date: ${selectedDate}`);
	  };
	  


	  //Now, to select the time use the following code
	  const [selectedTime, setSelectedTime] = useState('');

	  const handleTimeChange = (event) => {
		setSelectedTime(event.target.value);
	  };
	
	return (
		<>
			<Grid xs={12}>
				<Typography variant="h3" color="primary" align="center">
                    {t("title")}
				</Typography>
				{errorMessageVehicle && (
					<Alert severity="error">{errorMessageVehicle}</Alert>
				)}
				{errorMessageVisit === true && (
					<Alert security="success">{t("success")}</Alert>
				)}
				{typeof errorMessageVisit == "string" && (
					<Alert security="success">{t(errorMessageVisit)}</Alert>
				)}
				<Grid
					container
					sx={{ width: 1 }}
					spacing={2}
					component="form"
					action={dispatchVisit}
				>
					<Grid xs={12} md={6}>
						<Autocomplete
							id="autocomplete-name"
							sx={{ mt: 2, width: 1 }}
							disablePortal
							forcePopupIcon={false}
							noOptionsText={t("no_visitors")}
							value={name}
							open={openName}
							onClose={() => setOpenName(false)}
							options={visitorsName}
							renderInput={(params) => (
								<TextField
									{...params}
									label={t("name")}
									InputLabelProps={{ color: "secondary" }}
								/>
							)}
							renderOption={(props, option) => (
								<li {...props} key={props.key}>
									{option.label}
								</li>
							)}
							onInputChange={(event, value) => {
								if (rut != "") return;
								setOpenName(value.length > 0); // Set open to true when there's input
							}}
							onChange={(event, value) => {
								setName(value);
								//Keep both fields in sync
								if (!value) {
									setRut("");
									return;
								}
								setName(value.inputValue ?? value.label);
								let newVisitorRut = visitorsRut.find(
									(visitor) => visitor.id === value.id,
								)?.label;
								if (!newVisitorRut) {
									//User Clicked add...
									setTimeout(() => {
										setNewVisitorModal(true);
										let newVisitorObj;
										if (value.inputValue.split(" ").length < 2) {
											newVisitorObj = {
												rut: "",
												firstName: value.inputValue,
												lastName: "",
											};
										} else {
											newVisitorObj = {
												rut: "",
												firstName: value.inputValue.split(" ")[0],
												lastName: value.inputValue.split(" ")[1],
											};
										}

										setNewVisitor(newVisitorObj);
									});
								} else {
									setRut(newVisitorRut);
								}
							}}
							filterOptions={(options, params) => {
								const filtered = filter(options, params);
								if (params.inputValue !== "") {
									filtered.push({
										inputValue: params.inputValue,
										label: t("add", { input: params.inputValue }),
									});
								}
								return filtered;
							}}
						/>
					</Grid>
					<Grid xs={12} md={6}>
						<Autocomplete
							id="autocomplete-rut"
							sx={{ mt: 2, width: 1 }}
							disablePortal
							forcePopupIcon={false}
							noOptionsText={t("no_visitors")}
							value={rut}
							open={openRut}
							onClose={() => setOpenRut(false)}
							options={visitorsRut}
							renderInput={(params) => (
								<TextField
									{...params}
									label={t("rut")}
									InputLabelProps={{ color: "secondary" }}
								/>
							)}
							renderOption={(props, option) => (
								<li {...props} key={props.key}>
									{option.label}
								</li>
							)}
							onInputChange={(event, value) => {
								if (name != "") return;
								setOpenRut(value.trim().length > 0); // Set open to true when there's input
							}}
							onChange={(event, value) => {
								//Keep both fields in sync
								if (!value) {
									setName("");
									return;
								}
								setRut(value.inputValue ?? value.label);

								let newVisitorName = visitorsName.find(
									(visitor) => visitor.id === value.id,
								)?.label;
								if (!newVisitorName) {
									//User Clicked add...
									setTimeout(() => {
										setNewVisitorModal(true);
										setNewVisitor({
											rut: value.inputValue,
											firstName: "",
											lastName: "",
										});
									});
								} else {
									setName(newVisitorName);
								}
							}}
							filterOptions={(options, params) => {
								const filtered = filter(options, params);

								if (params.inputValue !== "") {
									filtered.push({
										inputValue: params.inputValue,
										label: t("add", { input: params.inputValue }),
									});
								}
								return filtered;
							}}
						/>
					</Grid>
					<Grid xs={12}>
						{rut && name && (
							<>
								<input
									type="hidden"
									name="visitor_id"
									value={
										visitorsRut.find((visitor) => visitor.label === rut).id
									}
								/>
								<input
									type="hidden"
									name="parking_space_id"
									value={selectedParkingSpace}
								/>
								<input type="hidden" name="residence_id" id="residence_id" />
								<input
									type="hidden"
									name="vehicle_id"
									value={
										visitorLicense?.find((lp) => lp.label === license)?.id ?? ""
									}
								/>
								<Grid container spacing={2}>
									<Grid xs={12} md={6}>
										<Autocomplete
											id="autocomplete-residence"
											disablePortal
											fullWidth
											forcePopupIcon={false}
											options={residences}
											renderInput={(params) => (
												<TextField
													{...params}
													label={t("residence")}
													inputProps={{
														...params.inputProps,
														name: "residence",
													}}
													InputLabelProps={{ color: "secondary" }}
												/>
											)}
											onChange={(event, value) => {
												if (!value) {
													return;
												}
												const visitor_id = visitorsRut.find(
													(visitor) => visitor.label === rut,
												).id;
												const fvr = frequentVisitors.filter(
													(visitor) =>
														visitor.residence_id === value.id &&
														visitor.visitor_id === visitor_id,
												);
												if (fvr.length > 0) {
													setFrequentVisitor(true);
												}

												document.getElementById("residence_id").value =
													value.id;
											}}
										/>
									</Grid>

									<Grid xs={12} md={6}>
										<TextField fullWidth></TextField>
									</Grid>
									<Grid xs={12}>
									{availableParkingSpaces.length === 0 ? (
													<Typography variant="body1" textAlign="center" color="textSecondary">
														{t("no_parking_space")}
													</Typography>
												) : (
													<Grid container spacing={2}>
														<Grid xs={12}>
															<Autocomplete
																id="autocomplete-license"
																disablePortal
																forcePopupIcon={false}
																value={license}
																options={visitorLicense}
																sx={{
																	width: { xs: "100%", md: "50%" },
																	margin: "auto",
																}}
																renderInput={(params) => (
																	<TextField
																		{...params}
																		label={t("licence_plate")}
																		InputLabelProps={{ color: "secondary" }}
																	/>
																)}
																renderOption={(props, option) => (
																	<li {...props} key={props.key}>
																		{option.label}
																	</li>
																)}
																onChange={(event, value) => {
																	if (!value) {
																		setLicense("");
																		return;
																	}

																	let newVisitorLicense = visitorLicense.find(
																		(license) => license.id === value.id,
																	)?.label;
																	if (!newVisitorLicense) {
																		setTimeout(() => {
																			setOpenLicenseModal(true);
																			setLicense(value.inputValue);
																			setVisitorVehicle({
																				license_plate: value.inputValue,
																				visitor_id: visitorsRut.find(
																					(visitor) => visitor.label === rut,
																				).id,
																				brand: "",
																				model: "",
																				color: "",
																			});
																		});
																	} else {
																		setLicense(newVisitorLicense);
																	}
																}}
																filterOptions={(options, params) => {
																	let filtered = filter(options, params);
																	//TODO:
																	//filter licence plates that dont belong to the visit
																	if (params.inputValue !== "") {
																		filtered.push({
																			inputValue: params.inputValue,
																			label: t("add", {
																				input: params.inputValue,
																			}),
																		});
																	}
																	return filtered;
																}}
															/>
														</Grid>
														<Grid
															container
															gap={1}
															sx={{
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																margin: "0 auto",
																width: 1,
															}}
														>
															{availableParkingSpaces.map((space) => (
																<ParkingSpace
																	key={space.id}
																	number={space.number}
																	id={space.id}
																	selected={selectedParkingSpace}
																	handleSelectParkingSpace={
																		handleSelectParkingSpace
																	}
																/>
															))}
														</Grid>
													</Grid>
												)}

									</Grid>
									{frequentVisitor && (
										<>
											<Grid xs={12}>
												<Alert severity="info" color="secondary">
													<Typography color={"primary"}>
														{t("is_frequent", { name: name })}
													</Typography>
												</Alert>
											</Grid>
										</>
									)}
									<Grid xs={12}>
      <TextField
		id="departure_date"
		name="departure_date"
        label={t("select_date")}
        type="date"
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
	   <TextField
	    id="departure_time"
		name="departure_time"
        label={t("select_time")}
        type="time"
        onChange={handleTimeChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
									</Grid>
									
									<Grid xs={12}>
										<TextField
											id="visit_reason"
											name="visit_reason"
											label={t("visit_reason")}
											multiline
											rows={4}
											sx={{ mt: 1, width: 1 }}
										></TextField>
									</Grid>

									<Grid
										xs={12}
										sx={{
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
										}}
									>
										<Button
											variant="outlined"
											size="large"
											type="submit"
											onClick={handleSubmitVisitor}
											sx={{
												mt: 2,
											}}
										>
											{t("register_visit")}
										</Button>
									</Grid>
								</Grid>
							</>
						)}
					</Grid>
					
				</Grid>
			</Grid>
			
		</>
	);
};

function ParkingSpace({ number, id, selected, handleSelectParkingSpace }) {
	return (
		<Grid
			xs={3}
			sm={2}
			md={1}
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{selected == id ? (
				<Button
					onClick={handleSelectParkingSpace}
					color="secondary"
					value={id}
					variant="contained"
				>
					{number}
				</Button>
			) : (
				<Button
					onClick={handleSelectParkingSpace}
					color="primary"
					value={id}
					variant="outlined"
				>
					{number}
				</Button>
			)}
		</Grid>
	);
}
