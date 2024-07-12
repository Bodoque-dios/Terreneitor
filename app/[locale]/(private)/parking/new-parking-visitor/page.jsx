import { Box, Button, Container, Typography, Alert } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import { ParkingComp } from "@components/ParkingComp";

import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@vercel/postgres";
import initTranslations from "@/app/i18n";
import { logger } from "@/logger";

export default async function ConciergeVisitors({ locale }) {
	const { t } = await initTranslations(locale, ["common"]);

	const session = await auth();
	logger.info(`User with the email:'${session?.user?.email}' has opened the visitors page.`);
	if (!session?.user || !session?.user?.email) return null;

	let visitors;
	let visitorsRut;
	let visitorsName;
    let visitorLicensePlates;
    let alert;
    let residences;
    let frequentVisitors;
    let availableParkingSpaces;

    const client = await db.connect();

	try {
		visitors = await client.sql`
        SELECT 
            id,
            rut, 
            firstname ||' '|| lastname AS name
        FROM visitor
        WHERE community_id = (SELECT community_id FROM user_info WHERE id = ${session.user.id})
      `;

		visitorsRut = visitors.rows.map((visitor) => ({
			label: visitor.rut,
			id: visitor.id,
		}));
		visitorsName = visitors.rows.map((visitor) => ({
			label: visitor.name,
			id: visitor.id,
		}));

        residences = await client.sql`
        SELECT
            id,
            community_address
        FROM 
            residence
        WHERE
            community_id = (SELECT community_id FROM user_info WHERE id = ${session.user.id})
        `;
        residences = residences.rows.map((residence) => ({
            label: residence.community_address,
            id: residence.id
        }));


        visitorLicensePlates = await client.sql`
        SELECT
            vv.id,
            vv.license_plate
        FROM
            visitor_vehicle vv
        JOIN
            visitor v ON v.id = vv.visitor_id
        WHERE
            v.community_id = (SELECT community_id FROM user_info WHERE id = ${session.user.id})
        `;
        visitorLicensePlates = visitorLicensePlates.rows.map((visitor) => ({
            label: visitor.license_plate,
            id: visitor.id
        }));

        frequentVisitors = await client.sql`
        SELECT
            fv.visitor_id,
            fv.residence_id
        FROM
            frequent_visitor fv
        inner join
                residence r on fv.residence_id = r.id
        WHERE
            r.community_id = (SELECT community_id FROM user_info WHERE id = ${session.user.id})
        `;
        frequentVisitors = frequentVisitors.rows.map((visitor) => ({
            visitor_id: visitor.visitor_id,
            residence_id: visitor.residence_id
        }));
        
        availableParkingSpaces = await client.sql`WITH occupied_spaces AS (
                SELECT
                    psu.parking_space_id,
                    vv.brand,
                    vv.model,
                    v.firstname,
                    v.lastname,
                    MAX(vtr.arrival) AS last_arrival
                FROM
                    parking_space_usage psu
                JOIN
                    visit_to_residence vtr ON psu.visit_id = vtr.id
                JOIN
                    visitor_vehicle vv ON psu.vehicle_id = vv.id
                join
                    visitor v on vv.visitor_id = v.id
                WHERE
                    vtr.departure IS NULL
                GROUP BY
                    psu.parking_space_id, vv.brand, vv.model, v.firstname, v.lastname
            )
            SELECT
                ps.id,
                ps.number
            FROM
                parking_space ps
            LEFT JOIN
                occupied_spaces os ON ps.id = os.parking_space_id
            WHERE
                ps.community_id = ${session.user.community_id}
                AND os.parking_space_id IS NULL
            ORDER BY
                ps.number;`;

        availableParkingSpaces = availableParkingSpaces.rows;
        
	} catch (error) {
        alert = "Error loading visitors."
		visitors = [];
		visitorsRut = [];
		visitorsName = [];
        residences = [];
        visitorLicensePlates = [];
        frequentVisitors = [];
        availableParkingSpaces = [];
	} finally {
        client.release();
	}
    logger.debug(`(${visitors?.fields?.length ?? 0}) visitors loaded.`);
    return (
		<Container maxWidth="lg" sx={{ mt: 2, flexGrow: 1 }}>
            {alert && <Alert severity="error">{alert}</Alert>}
			<Grid container spacing={2} height="100%">
				<ParkingComp
                    visitorsRut={visitorsRut}
                    visitorsName={visitorsName}
                    residences={residences}
                    visitorLicense={visitorLicensePlates}
                    frequentVisitors={frequentVisitors}
                    availableParkingSpaces={availableParkingSpaces}
                />


			</Grid>
		</Container>
	);
}
