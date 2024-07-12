// components/ParkingManagement.jsx
import { useState, useMemo } from "react";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import SpotConfigPopover from '@/app/components/ChangeTime';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';
import { setVisitToResidenceNull } from '@/app/lib/actions';
import Link from "next/link";
import { useTranslation } from "react-i18next";

function NOW() {
	return new Date();
  }

const ParkingManagement = ({ parking_state, parking_DB }) => {


	const { t } = useTranslation("common", {
		keyPrefix: "parking_view",
	});

  	const [parkingSpaces, setParkingSpaces] = useState(

    Object.entries(parking_DB).map(([id, parking]) => {
      if ( parking.salida < NOW()){
        return { id: parking.id,  visitor: "N/A", car: "N/A",  departure: "N/A", number: parking.number, status: "available" };
      } else {
		const departureString = parking.salida.toLocaleString(); 
        return { id: parking.id, visitor_id: parking.the_visitor_id, used_space_id: parking.parking_used_id, visitor: parking.firstname + " " + parking.lastname, car: parking.brand +"/" + parking.model,  departure: departureString, number: parking.number, status: "occupied" };
      }
    })
  );

	const [sortBy, setSortBy] = useState("number");
	const [sortDirection, setSortDirection] = useState("asc");
	const [filterStatus, setFilterStatus] = useState("all");

	const handleSort = (key) => {
		if (sortBy === key) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortBy(key);
			setSortDirection("asc");
		}
	};

	const handleFilterStatus = (status) => {
		setFilterStatus(status);
	};

	const handleUpdateStatus = (id, status) => {
		setParkingSpaces(
			parkingSpaces.map((space) =>
				space.id === id ? { ...space, status } : space,
			),
		);
	};
	const handleUpdateParking = () => {
		setTimeout(() => {
			//we reload the page to update the visitors list using plain js
			window.location.reload();
		}, 3000);
	};

	const filteredAndSortedSpaces = useMemo(() => {
		let spaces = [...parkingSpaces];
		if (filterStatus !== "all") {
			spaces = spaces.filter((space) => space.status === filterStatus);
		}
		spaces.sort((a, b) => {
			if (a[sortBy] < b[sortBy]) return sortDirection === "asc" ? -1 : 1;
			if (a[sortBy] > b[sortBy]) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});
		return spaces;
	}, [parkingSpaces, sortBy, sortDirection, filterStatus]);

	// Here we define the state for the popover component
	const [anchorEl, setAnchorEl] = useState(null);
	const handlePopClick = (event) => {
	  setAnchorEl(event.currentTarget);
	};
	const handlePopClose = () => {
	  setAnchorEl(null);
	};
	const open = Boolean(anchorEl);


	const [anchorEl_new_vehicle, setAnchorEl_new_vehicle] = useState(null);
	const handlePopClick_new_vehicle = (event) => {
	  setAnchorEl_new_vehicle(event.currentTarget);
	};
	const handlePopClose_new_vehicle = () => {
	  setAnchorEl_new_vehicle(null);
	};
	const open_new_vehicle = Boolean(anchorEl_new_vehicle);

	
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
	return (
		<div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
			<Typography variant="h4" component="h1" gutterBottom>
				{t("title")}
			</Typography>

			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					
					<Button
						variant={filterStatus === "all" ? "contained" : "outlined"}
						onClick={() => handleFilterStatus("all")}
					>
						{t("view_all")}
					</Button>
					<Button
						variant={filterStatus === "available" ? "contained" : "outlined"}
						onClick={() => handleFilterStatus("available")}
					>
						{t("view_available")}

					</Button>
					<Button
						variant={filterStatus === "occupied" ? "contained" : "outlined"}
						onClick={() => handleFilterStatus("occupied")}
					>
						{t("view_occupied")}
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<Typography variant="body2" color="textSecondary">
						{t("sort")}
					</Typography>
					<Button
						variant={sortBy === "number" ? "contained" : "outlined"}
						onClick={() => handleSort("number")}
					>
						{t("sort_1")}{" "}
						{sortBy === "number" &&
							(sortDirection === "asc" ? "\u2191" : "\u2193")}
					</Button>
					<Button
						variant={sortBy === "status" ? "contained" : "outlined"}
						onClick={() => handleSort("status")}
					>
						{t("sort_2")}{" "}
						{sortBy === "status" &&
							(sortDirection === "asc" ? "\u2191" : "\u2193")}
					</Button>
				</div>
			</div>
			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded-full bg-green-500" />
					<span className="text-gray-500 dark:text-gray-400">
						{t("available_parking")} {parking_state.available_spaces}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded-full bg-red-500" />
					<span className="text-gray-500 dark:text-gray-400">
						{t("occupied_parking")} {parking_state.ocupied_spaces}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded-full bg-gray-500" />
					<span className="text-gray-500 dark:text-gray-400">
						{t("all_parking")} {parking_state.total_spaces}
					</span>
				</div>
			</div>
			<div className="overflow-x-auto">
				
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>{t("number_column")}</TableCell>
							<TableCell>{t("visitor_column")}</TableCell>
							<TableCell>{t("car_column")}</TableCell>
							<TableCell>{t("state_column")}</TableCell>
							<TableCell>{t("departure_column")}</TableCell>
							<TableCell>{t("action_column")}</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredAndSortedSpaces.map((space) => (
							<TableRow key={space.id}>
								<TableCell>{space.number}</TableCell>
								<TableCell>{space.visitor}</TableCell> 
								<TableCell>{space.car}</TableCell>
								<TableCell>
									<div
										className={`px-3 py-1 rounded-full text-xs font-medium ${
											space.status === "available"
												? "bg-green-100 text-green-800"
												: "bg-red-100 text-red-800"
										}`}
									>
										{space.status}
									</div>
								</TableCell>
								<TableCell>{space.departure}</TableCell>
								
								<TableCell>



								{space.status === "available" ? (



									<div>
										<Button
										variant="outlined"
										size="small"
										onClick={handlePopClick_new_vehicle}
										>
										{t("action_reserve")}
										</Button>



										<Popover
											open={open_new_vehicle}
											anchorEl={anchorEl_new_vehicle}
											onClose={handlePopClose_new_vehicle}
											anchorOrigin={{
											vertical: 'bottom',
											}}
											transformOrigin={{
											vertical: 'top',
											}}
									>
										<PopoverContent>
										<Grid>
											<ButtonContainer >
												<Button variant="outlined" size="small" onClick={handlePopClose_new_vehicle} >
													{t("action_reserve_cancel")}
												</Button>
												<Link
												href="/parking/new-parking-visitor"
												style={{ textDecoration: "none" }}
												>
													<Button variant="contained" size="small" color="primary" onClick={handlePopClose_new_vehicle}>
														{t("action_reserve_add")}
													</Button>
												</Link>
											


											</ButtonContainer>
										</Grid>
										</PopoverContent>
									</Popover>

									</div>



									) :



									<div>
													<Button
									variant="outlined"
									size="small"
									onClick={handlePopClick}
									>
										{t("action_remove")}
									</Button>

									<Popover
										open={open}
										anchorEl={anchorEl}
										onClose={handlePopClose}
										anchorOrigin={{
										vertical: 'bottom',
										}}
										transformOrigin={{
										vertical: 'top',
										}}
									>
										<PopoverContent>
										<Grid>
											<ButtonContainer>
												<Button variant="outlined" size="small" onClick={handlePopClose}>
													{t("action_remove_cancel")}
												</Button>

												<Button variant="contained" size="small" color="primary" onClick={() => { setVisitToResidenceNull(space.visitor_id,space.id); handlePopClose; handleUpdateParking;
												window.location.reload(); // Esto recargará la págin
													
												 }}>
													{t("action_remove_action")}
												</Button>
											</ButtonContainer>
										</Grid>
										</PopoverContent>
									</Popover>
									</div>
									}









									
								</TableCell>
								<TableCell>
								{space.status === "occupied" && <SpotConfigPopover data ={space.visitor_id}/>}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>

			</div>
		</div>
	);
};
export default ParkingManagement;