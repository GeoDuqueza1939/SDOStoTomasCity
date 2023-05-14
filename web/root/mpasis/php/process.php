<?php E_STRICT;
session_start();

class ajaxResponse implements JsonSerializable
{
	private $type; // possible values: "Success", "Info", "Error", "Text", "Username", "JSON", "DataRows", "DataRow", "User", "Entries", "Entry"
	private $content;
	
	public function __construct($type, $content)
	{
		$this->type = $type;
		$this->content = $content;
	}
	
	public function get_type()
	{
		return $this->type;
	}
	
	public function get_content()
	{
		return $this->content;
	}
	
	public function to_array()
	{
        return array(
            "type"=>$this->type,
            "content"=>$this->content
        );
	}
	
	// override to allow json_encode() to convert an instance of this class
	public function jsonSerialize ()
	{ 
		return $this->to_array();
    }
};
require_once('../../path.php');

require_once(__FILE_ROOT__ . '/php/classes/db.php');
require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');
require_once(__FILE_ROOT__ . '/php/audit/log.php');
require_once(__FILE_ROOT__ . '/php/secure/validateUser.php');

function sendDebug($data)
{
    echo(json_encode(new ajaxResponse('Debug', json_encode($data))));
    exit;
}

function selectJobApplications(DatabaseConnection $dbconn, $where = "", $limit = 0, $isDebug = false) // return a json_encoded ajaxResponse; $where can be a string of colname='value' or colname LIKE 'value' pairs
{
    $query = "SELECT
        pe.personId as personId,
        given_name,
        middle_name,
        family_name,
        spouse_name,
        ext_name,
        birth_date,
        birth_place,
        sex,
        age,
        ecs.index as civil_statusIndex,
        ecs.civil_status as civil_status,
        r.religionId as religionId,
        r.religion as religion,
        eth.ethnicityId as ethnicityId,
        eth.ethnic_group as ethnic_group,
        permAdd.addressId as permanent_addressId,
        permAdd.address as permanent_address,
        presAdd.addressId as present_addressId,
        presAdd.address as present_address,
        eea.index as educational_attainmentIndex,
        eea.educational_attainment as educational_attainment,
        application_code,
        position_title_applied,
        parenthetical_title_applied,
        plantilla_item_number_applied,
        has_specific_education_required,
        has_specific_training,
        has_more_unrecorded_training,
        has_specific_work_experience,
        has_more_unrecorded_work_experience,
        has_specific_competency_required,
        most_recent_performance_rating,
        performance_cse_gwa_rating,
        performance_cse_honor_grad,
        number_of_citation_movs,
        number_of_academic_award_movs,
        number_of_awards_external_office_search,
        number_of_awards_external_org_level_search,
        number_of_awards_central_co_level_search,
        number_of_awards_central_national_search,
        number_of_awards_regional_ro_level_search,
        number_of_awards_regional_national_search,
        number_of_awards_division_sdo_level_search,
        number_of_awards_division_national_search,
        number_of_awards_school_school_level_search,
        number_of_awards_school_sdo_level_search,
        number_of_research_proposal_only,
        number_of_research_proposal_ar,
        number_of_research_proposal_ar_util,
        number_of_research_proposal_ar_util_adopt,
        number_of_research_proposal_ar_util_cite,
        number_of_smetwg_issuance_cert,
        number_of_smetwg_issuance_cert_output,
        number_of_speakership_external_office_level,
        number_of_speakership_external_org_level,
        number_of_speakership_central_co_level,
        number_of_speakership_central_national_level,
        number_of_speakership_regional_ro_level,
        number_of_speakership_regional_national_level,
        number_of_speakership_division_sdo_level,
        number_of_speakership_division_regional_level,
        number_of_speakership_school_school_level,
        number_of_speakership_school_sdo_level,
        neap_facilitator_accreditation,
        number_of_app_educ_r_actionplan,
        number_of_app_educ_r_actionplan_ar,
        number_of_app_educ_r_actionplan_ar_adoption,
        number_of_app_educ_nr_actionplan,
        number_of_app_educ_nr_actionplan_ar,
        number_of_app_educ_nr_actionplan_ar_adoption,
        app_educ_gwa,
        number_of_app_train_relevant_cert_ap,
        number_of_app_train_relevant_cert_ap_arlocal,
        number_of_app_train_relevant_cert_ap_arlocal_arother,
        number_of_app_train_not_relevant_cert_ap,
        number_of_app_train_not_relevant_cert_ap_arlocal,
        number_of_app_train_not_relevant_cert_ap_arlocal_arother,
        score_exam,
        score_skill,
        score_bei
    FROM SDOStoTomas.Person pe
    INNER JOIN SDOStoTomas.Job_Application ja ON ja.personId = pe.personId
    LEFT JOIN SDOStoTomas.ENUM_Educational_Attainment eea ON pe.educational_attainment = eea.index
    LEFT JOIN SDOStoTomas.ENUM_Civil_Status ecs ON pe.civil_status = ecs.index
    LEFT JOIN SDOStoTomas.Religion r ON pe.religionId = r.religionId
    LEFT JOIN SDOStoTomas.Ethnicity eth ON pe.ethnicityId = eth.ethnicityId
    LEFT JOIN SDOStoTomas.Address presAdd ON pe.present_addressId = presAdd.addressId
    LEFT JOIN SDOStoTomas.Address permAdd ON pe.permanent_addressId = permAdd.addressId"
    . (is_null($where) || (is_string($where) && trim($where) == "") ? "" : " WHERE $where")
    . (is_null($limit) || !is_numeric($limit) ? "" : " LIMIT $limit");

    $dbResults = $dbconn->executeQuery($query);

    if (is_null($dbconn->lastException))
    {
        for ($i = 0; $i < count($dbResults); $i++)
        {
            $dbResult = $dbResults[$i];

            $fullName = (is_string($dbResult['spouse_name']) && $dbResult['spouse_name'] != '' ? $dbResult['spouse_name'] . ', ' : (is_string($dbResult['family_name']) && $dbResult['family_name'] != '' ? $dbResult['family_name'] . ', ' : ''));
            $fullName .= $dbResult['given_name'];
            $fullName .= ($fullName == '' ? '' : ' ') . (is_string($dbResult['middle_name']) && $dbResult['middle_name'] != "" ? $dbResult['middle_name'] : '');
            $fullName = trim($fullName);
            $fullName .= (is_string($dbResult['spouse_name']) && $dbResult['spouse_name'] != '' ? ' ' . $dbResult['family_name'] : '');
            $fullName = trim($fullName);

            $dbResults[$i]['applicant_name'] = $fullName;
            $dbResults[$i]['applicant_option_label'] = $dbResult['application_code'] . " &ndash; $fullName &ndash; " . $dbResult['position_title_applied'];

            $dbResults2 = $dbconn->select("Degree_Taken", "degree_takenId, degree, degree_typeIndex, year_level_completed, units_earned, complete_academic_requirements, graduation_year", "WHERE personId='" . $dbResults[$i]['personId'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['degree_taken'] = $dbResults2;
            }
            else
            {
                return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->executeQuery("SELECT person_disabilityId, pd.disabilityId as disabilityId, disability FROM Disability d INNER JOIN Person_Disability pd ON d.disabilityId=pd.disabilityId WHERE personId='" . $dbResults[$i]['personId'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['disability'] = $dbResults2;
            }
            else
            {
                return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->select("Email_Address", "email_address", "WHERE personId='" . $dbResults[$i]['personId'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['email_address'] = $dbResults2;
            }
            else
            {
                return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->select("Contact_Number", "contact_numberId, contact_number", "WHERE personId='" . $dbResults[$i]['personId'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['contact_number'] = $dbResults2;
            }
            else
            {
                return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->select("Relevant_Training", "relevant_trainingId, descriptive_name, hours", "WHERE application_code='" . $dbResults[$i]['application_code'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['relevant_training'] = $dbResults2;
            }
            else
            {
                return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->select("Relevant_Work_Experience", "relevant_work_experienceId, descriptive_name, start_date, end_date", "WHERE application_code='" . $dbResults[$i]['application_code'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['relevant_work_experience'] = $dbResults2;
            }
            else
            {
                return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            // $dbResults2 = $dbconn->select("Relevant_Eligibility", "relevant_eligibilityId, eligibilityId", "WHERE application_code='" . $dbResults[$i]['application_code'] . "'");
            $dbResults2 = $dbconn->executeQuery("SELECT relevant_eligibilityId, Relevant_Eligibility.eligibilityId, eligibility FROM Relevant_Eligibility INNER JOIN Eligibility ON Relevant_Eligibility.eligibilityId=Eligibility.eligibilityId WHERE application_code='" . $dbResults[$i]['application_code'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['relevant_eligibility'] = $dbResults2;
            }
            else
            {
                return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }
        }

        return json_encode(new ajaxResponse(($isDebug ? 'Debug' : 'Data'), json_encode($dbResults)));
    }
        
    return json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
}

// TEST ONLY !!!!!!!!!!!!!
if (isset($_REQUEST['test']))
{
    echo(json_encode(new ajaxResponse('Info','test reply')));
    return;
}
// TEST ONLY !!!!!!!!!!!!!
// echo(json_encode(new ajaxResponse('Debug', json_encode($_REQUEST))));
// exit;

if (isValidUserSession())
{    
    if (isset($_REQUEST['q']) && $_REQUEST['q'] == 'login') // UNUSED
    {
        echo json_encode(new ajaxResponse('User', json_encode(array('Username'=>$_SESSION['user'], 'UserId'=>1 * $_SESSION['user_id']))));
        return;
	}
    elseif (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout') // UNUSED
    {
        session_unset();
		session_destroy();
		echo json_encode(new ajaxResponse('Success', 'Signed out.'));
        return;
    }
    elseif (isset($_REQUEST['a']))
    {
        $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, []);

        switch($_REQUEST['a'])
        {
            case 'fetch':
                switch($_REQUEST['f'])
                {
                    case 'users':
                        $criteriaStr = (isset($_REQUEST['k']) && trim($_REQUEST['k']) == 'all' ? '' : ' WHERE All_User.username LIKE "%' . trim($_REQUEST['k']) . '%" OR given_name LIKE "%' . trim($_REQUEST['k']) . '%" OR middle_name LIKE "%' . trim($_REQUEST['k']) . '%" OR family_name LIKE "%' . trim($_REQUEST['k']) . '%" OR spouse_name LIKE "%' . trim($_REQUEST['k']) . '%" OR ext_name LIKE "%' . trim($_REQUEST['k']) . '%"');
                        
                        echo(json_encode(new ajaxResponse('Data', json_encode(fetchUser($dbconn, '', $criteriaStr)))));
                        // echo(json_encode(new ajaxResponse('Data', fetchUser($dbconn, '', $criteriaStr))));
                        // $dbResults = $dbconn->executeQuery(
                        //     getUserFetchQuery() . $criteriaStr . ';'
                        // );
    
                        // if (is_null($dbconn->lastException))
                        // {
                        //     logAction('mpasis', 11, array(
                        //         ($_SESSION['user']["is_temporary_user"] ? 'temp_' : '') . "username"=>$_SESSION['user']['username'],
                        //         // ($isTempUser ? 'temp_' : '') . 'username_op'=>$user['username']
                        //         'username_op'=>$user['username']
                        //     ));
                        //     echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        // }
                        // else
                        // {
                        //     echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        // }
                        return;
                        break;
                    case 'tempuser':
                        $dbResults = $dbconn->executeQuery(
                            'SELECT 
                                given_name,
                                middle_name,
                                family_name,
                                spouse_name,
                                ext_name,
                                username,
                                sergs_access_level,
                                opms_access_level,
                                mpasis_access_level
                            FROM SDOStoTomas.Person
                            INNER JOIN SDOStoTomas.Temp_User
                            ON Person.personId=Temp_User.personId' . (isset($_REQUEST['k']) && trim($_REQUEST['k']) == 'all' ? '' : ' WHERE Temp_User.username LIKE "' . trim($_REQUEST['k']) . '";')
                        );
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'searchApplicationByName':
                        $dbResults = $dbconn->executeQuery(
                            'SELECT
                                *
                            FROM SDOStoTomas.Person
                            INNER JOIN SDOStoTomas.Job_Application
                            ON Person.personId=Job_Application.personId
                            WHERE Person.given_name LIKE "%' . $_REQUEST['name'] . '%" OR Person.family_name LIKE "%' . $_REQUEST['name'] . '%" OR Person.spouse_name LIKE "%' . $_REQUEST['name'] . '%"'
                        );
                        $results = [];

                        foreach ($dbResults as $dbResult)
                        {
                            $results[$dbResult['application_code']] = $dbResult;
                        }
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($results))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'initial-data':
                        $positions = $dbconn->select('Position', '*', '');

                        if (is_null($dbconn->lastException))
                        {
                            $requiredEligibilities = $dbconn->executeQuery(
                                'SELECT
                                    required_eligibilityId,
                                    plantilla_item_number,
                                    re2.eligibilityId,
                                    re2.eligibility,
                                    eligibilityId2,
                                    eligibility2,
                                    eligibilityId3,
                                    e3.eligibility as eligibility3
                                FROM
                                    (SELECT
                                        required_eligibilityId,
                                        plantilla_item_number,
                                        re.eligibilityId,
                                        re.eligibility,
                                        eligibilityId2,
                                        e2.eligibility as eligibility2,
                                        eligibilityId3
                                    FROM 
                                        (SELECT
                                            required_eligibilityId,
                                            plantilla_item_number,
                                            Required_Eligibility.eligibilityId,
                                            eligibility,
                                            eligibilityId2,
                                            eligibilityId3
                                        FROM Required_Eligibility
                                        INNER JOIN Eligibility ON Required_Eligibility.eligibilityId = Eligibility.eligibilityId) re
                                    LEFT JOIN Eligibility e2 ON re.eligibilityId2 = e2.eligibilityId) re2
                                LEFT JOIN Eligibility e3 on re2.eligibilityId3 = e3.eligibilityId
                                ;'
                            );

                            if (is_null($dbconn->lastException))
                            {
                                for ($i = 0; $i < count($positions); $i++) {
                                    $positions[$i]['required_eligibility'] = [];

                                    foreach ($requiredEligibilities as $requiredEligibility)
                                    {
                                        if ($requiredEligibility['plantilla_item_number'] == $positions[$i]['plantilla_item_number'])
                                        {
                                            array_push($positions[$i]['required_eligibility'], $requiredEligibility);
                                        }
                                    }
                                }

                                $salaryGrade = $dbconn->select('Salary_Table', '*', 'WHERE effectivity_date >= "2023-01-01"');

                                if (!is_null($dbconn->lastException))
                                {
                                    echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                                    return;
                                }

                                $educIncrementTable = $dbconn->select('MPS_Increment_Table_Education', '*', '');

                                if (!is_null($dbconn->lastException))
                                {
                                    echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                                    return;
                                }

                                $enumEducAttainment = $dbconn->select('ENUM_Educational_Attainment', '*', '');

                                if (is_null($dbconn->lastException))
                                {
                                    echo(json_encode(new ajaxResponse('Data', json_encode(['positions'=>$positions, 'salary_grade'=>$salaryGrade, 'mps_increment_table_education'=>$educIncrementTable, 'enum_educational_attainment'=>$enumEducAttainment]))));
                                }
                                else
                                {
                                    echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                                }
                            }
                            else
                            {
                                echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                            }
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'positions':
                        $dbResults = $dbconn->select('Position', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'positionTitles':
                        $dbResults = $dbconn->select('Position', 'position_title', 'GROUP BY position_title');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'parenTitles':
                        $where = (isset($_REQUEST['positionTitle']) ? 'WHERE position_title="' . $_REQUEST['positionTitle'] . '"' : '');

                        $dbResults = $dbconn->select('Position', 'parenthetical_title, position_title', ($where == '' ? '' : $where));
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'plantilla':
                        $where = (isset($_REQUEST['positionTitle']) ? 'WHERE position_title="' . $_REQUEST['positionTitle'] . '"' : '');
                        $where .= (isset($_REQUEST['parenTitle']) ? ($where == '' ? 'WHERE' : 'AND') . ' parenthetical_title="' . $_REQUEST['parenTitle'] . '"' : '');

                        $dbResults = $dbconn->select('Position', 'plantilla_item_number', ($where == '' ? '' : $where));
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'positionCategory':
                        $dbResults = $dbconn->select('Position_Category', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'educLevel':
                        $dbResults = $dbconn->select('ENUM_Educational_Attainment', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'univEducLevel':
                        $dbResults = $dbconn->select('ENUM_Educational_Attainment', '*', 'WHERE `index` > 5');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'specEduc':
                        $dbResults = $dbconn->select('Specific_Education', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'civilStatus':
                        $dbResults = $dbconn->select('ENUM_Civil_Status', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'disability':
                        $dbResults = $dbconn->select('Disability', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'ethnicGroup':
                        $dbResults = $dbconn->select('Ethnicity', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'religion':
                        $dbResults = $dbconn->select('Religion', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'eligibilities':
                        $dbResults = $dbconn->select('Eligibility', '*', '');
    
                        if (is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Data', json_encode($dbResults))));
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                        }
                        return;
                        break;
                    case 'applicationsByApplicantOrCode':
                        $srcStr = (isset($_REQUEST['srcStr']) ? $_REQUEST['srcStr'] : "");
                        if ($srcStr == '')
                        {
                            die(json_encode(new ajaxResponse('Info', 'Blank search string')));
                        }

                        exit(selectJobApplications($dbconn, "given_name LIKE '%$srcStr%' OR middle_name LIKE '%$srcStr%' OR family_name LIKE '%$srcStr%' OR spouse_name LIKE '%$srcStr%' OR ext_name LIKE '%$srcStr%' OR application_code LIKE '%$srcStr%'", 100));
                        break;
                    case 'applicationsByPosition':
                        $positionTitle = trim(isset($_REQUEST['positionTitle']) && !is_null($_REQUEST['positionTitle']) ? $_REQUEST['positionTitle'] : '');
                        $parenTitle = trim(isset($_REQUEST['parenTitle']) && !is_null($_REQUEST['parenTitle']) ? $_REQUEST['parenTitle'] : '');
                        $plantilla = trim(isset($_REQUEST['plantilla']) && !is_null($_REQUEST['plantilla']) ? $_REQUEST['plantilla'] : '');
                        $where = '';
                        if ($positionTitle == '' && $plantilla == '')
                        {
                            die(json_encode(new ajaxResponse('Error', 'Invalid position and plantilla item number strings')));
                        }

                        $where .= ($plantilla == '' ? "position_title_applied='$positionTitle'" . ($parenTitle == '' ? '' : " AND parenthetical_title_applied=$parenTitle") : "plantilla_item_number_applied='$plantilla'");
                        
                        exit(selectJobApplications($dbconn, $where, 100, false));
                        break;
                    default:
                        break;
                }
                break;
            case 'add':
                if (isset($_REQUEST['eligibilities']))
                {
                    $eligibilities = json_decode($_REQUEST['eligibilities'], true);
    
                    $errMsg = '';
                    $valueStr = '';
    
                    foreach ($eligibilities as $eligibility)
                    {
                        $valueStr .= ($valueStr == '' ? '' : ', ') . '("' . $eligibility['eligibility'] . '","' . $eligibility['description'] . '")';
                    }
    
                    $dbconn->insert('Eligibility', '(eligibility, description)', $valueStr);
    
                    if (is_null($dbconn->lastException))
                    {
                        // echo(json_encode(new ajaxResponse('Success', $_REQUEST['eligibilities'])));
                        echo(json_encode(new ajaxResponse('Success', 'Eligibility successfully added')));
                    }
                    else
                    {
                        echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                    }
                    
                    return;
                }
                elseif (isset($_REQUEST['specEducs'])) // THIS SECTION NEEDS TO BE MODIFIED IF EVER IT IS TO BE USED AGAIN; SPECIFIC_EDUCATION REQUIRES A JOB_APPLICATION
                {
                    $specEducs = json_decode($_REQUEST['specEducs'], true);
                    
                    $errMsg = '';
                    $valueStr = '';
                    
                    foreach ($specEducs as $specEduc)
                    {
                        
                        $valueStr .= ($valueStr == '' ? '' : ', ') . '("' . $specEduc['specific_education'] . '","' . $specEduc['description'] . '")';
                    }
    
                    $dbconn->insert('Specific_Education', '(specific_education, description)', $valueStr);
    
                    if (is_null($dbconn->lastException))
                    {
                        echo(json_encode(new ajaxResponse('Success', 'Specific course/education successfully added')));
                    }
                    else
                    {
                        echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                    }
                    
                    return;
                }
                elseif (isset($_REQUEST['positions']))
                {
                    $positions = json_decode($_REQUEST['positions'], true);

                    foreach($positions as $position)
                    {
                        $fieldStr = '';
                        $valueStr = '';

                        
                        foreach($position as $key => $value)
                        {
                            if ($key != 'required_eligibility')
                            {
                                $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$value'";
                                $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;
                            }
                        }
                        $fieldStr = '(' . $fieldStr . ')';
                        $valueStr = '(' . $valueStr . ')';

                        // foreach($position['required_eligibility'] as $reqElig)
                        // {
                        //     echo($reqElig);
                        //     echo("x");
                        // }

                        $dbconn->insert('Position', $fieldStr, $valueStr);

                        if (is_null($dbconn->lastException))
                        {
                            foreach($position['required_eligibility'] as $reqElig)
                            {
                                $dbconn->insert('Required_Eligibility', '(plantilla_item_number, eligibilityId)', '("' . $position['plantilla_item_number'] . '", "' . $reqElig . '")');

                                if (!is_null($dbconn->lastException))
                                {
                                    echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                    return;        
                                }
                            }
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                            return;
                        }
                    }
                    
                    echo(json_encode(new ajaxResponse('Success', 'Successfully added Position details!')));
                    
                    return;
                }
                elseif (isset($_REQUEST['jobApplication']))
                {
                    $jobApplication = json_decode($_REQUEST['jobApplication'], true);
                    $param = [];
                    $updatePerson = false;
                    $updateJobApplication = false;
                    $personId = null;
                    $applicationCode = $jobApplication['application_code'];

                    if (isset($jobApplication['application_code']))
                    {
                        $param['application_code'] = $jobApplication['application_code'];
                    }

                    if (isset($jobApplication['position_title_applied']))
                    {
                        $param['position_title'] = $jobApplication['position_title_applied'];
                    }

                    if (isset($jobApplication['plantilla_item_number_applied']))
                    {
                        $param['plantilla_item_number'] = $jobApplication['plantilla_item_number_applied'];
                    }

                    logAction("mpasis", 6, $param);
                    
                    $personalInfo = $jobApplication["personalInfo"];

                    if (isset($jobApplication["personalInfo"]["personId"]))
                    {
                        $updatePerson = true;
                        $personId = $jobApplication["personalInfo"]["personId"];
                    }

                    $fieldStr = '';
                    $valueStr = '';

                    $addressIds = [];

                    if (isset($personalInfo["addresses"]) && count($personalInfo["addresses"]) > 0)
                    {
                        foreach ($personalInfo["addresses"] as $address) {
                            $fieldStr = '(address)';
                            $valueStr = "('$address')";

                            $dbconn->insert('Address', $fieldStr, $valueStr);
    
                            if (is_null($dbconn->lastException))
                            {
                                array_push($addressIds, $dbconn->lastInsertId);
                            }
                            else
                            {
                                echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                return;
                            }    
                        }
                    } // $addressIds[0]: present; $addressIds[1]: permanent;

                    if (isset($personalInfo["religion"]))
                    {
                        $religion = $personalInfo["religion"];
                        $fieldStr = '(religion)';
                        $valueStr = "('$religion')";

                        $dbResults = $dbconn->select('Religion', 'religionId', "WHERE religion='" . $religion . "'");

                        if (is_null($dbconn->lastException) && count($dbResults) > 0)
                        {
                            $religionId = $dbResults[0]['religionId'];
                        }
                        else
                        {
                            $dbconn->insert('Religion', $fieldStr, $valueStr);
    
                            if (is_null($dbconn->lastException))
                            {
                                $religionId = $dbconn->lastInsertId;
                            }
                            else
                            {
                                echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                return;
                            }    
                        }
                    }

                    if (isset($personalInfo["ethnicity"]))
                    {
                        $ethnicity = $personalInfo["ethnicity"];
                        $fieldStr = '(ethnic_group)';
                        $valueStr = "('$ethnicity')";

                        $dbResults = $dbconn->select('Ethnicity', 'ethnicityId', "WHERE ethnic_group='" . $ethnicity . "'");

                        if (is_null($dbconn->lastException) && count($dbResults) > 0)
                        {
                            $ethnicityId = $dbResults[0]['ethnicityId'];
                        }
                        else
                        {
                            $dbconn->insert('Ethnicity', $fieldStr, $valueStr);
    
                            if (is_null($dbconn->lastException))
                            {
                                $ethnicityId = $dbconn->lastInsertId;
                            }
                            else
                            {
                                echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                return;
                            }    
                        }
                    }

                    if (isset($personalInfo["disabilities"]) && count($personalInfo["disabilities"]) > 0)
                    {
                        $disabilityIds = [];

                        foreach ($personalInfo["disabilities"] as $disability)
                        {
                            $fieldStr = '(disability)';
                            $valueStr = "('$disability')";

                            $dbResults = $dbconn->select('Disability', 'disabilityId', "WHERE disability='" . $disability . "'");
    
                            if (is_null($dbconn->lastException) && count($dbResults) > 0)
                            {
                                array_push($disabilityIds, $dbResults[0]['disabilityId']);
                            }
                            else
                            {
                                $dbconn->insert('Disability', $fieldStr, $valueStr);
        
                                if (is_null($dbconn->lastException))
                                {
                                    array_push($disabilityIds, $dbconn->lastInsertId);
                                }
                                else
                                {
                                    echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                    return;
                                }    
                            }
                        }
                    }

                    $fieldStr = '';
                    $valueStr = '';

                    $fieldValueStr = '';

                    foreach($personalInfo as $key => $value)
                    {
                        if ($key != 'personId' && $key != "addresses" && $key != "religion" && $key != "disabilities" && $key != "ethnicity" && $key != "email_addresses" && $key != "contact_numbers" && $key != 'degree_taken')
                        {
                            if ($updatePerson)
                            {
                                $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . "$key='$value'";
                            }
                            else
                            {
                                $valueStr .= ($fieldStr == '' ? '' : ', ') . ($value == '' || is_null($value) ? 'NULL' : "'$value'");
                                $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;
                            }
                        }
                    }
                    
                    for ($i = 0; $i < count($addressIds); $i++)
                    {
                        if ($updatePerson)
                        {
                            $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . ($i == 0 ? 'present' : 'permanent') . '_addressId' . "='$addressIds[$i]'";
                        }
                        else
                        {
                            $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$addressIds[$i]'";
                            $fieldStr .= ($fieldStr == '' ? '' : ', ') . ($i == 0 ? 'present' : 'permanent') . '_addressId';
                        }
                    }

                    if (isset($religionId))
                    {
                        if ($updatePerson)
                        {
                            $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . "religionId='$religionId'";
                        }
                        else
                        {
                            $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$religionId'";
                            $fieldStr .= ($fieldStr == '' ? '' : ', ') . 'religionId';
                        }
                    }
                    
                    if (isset($ethnicityId))
                    {
                        if ($updatePerson)
                        {
                            $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . "ethnicityId='$ethnicityId'";
                        }
                        else
                        {
                            $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$ethnicityId'";
                            $fieldStr .= ($fieldStr == '' ? '' : ', ') . 'ethnicityId';
                        }
                    }

                    if ($updatePerson)
                    {
                        $dbconn->update('Person', $fieldValueStr, "WHERE personId=$personId");

                        if (!is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                            return;
                        }
                    }
                    else
                    {
                        $fieldStr = '(' . $fieldStr . ')';
                        $valueStr = '(' . $valueStr . ')';
    
                        $dbconn->insert('Person', $fieldStr, $valueStr);
    
                        if (is_null($dbconn->lastException))
                        {
                            $personId = $dbconn->lastInsertId;
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                            return;
                        }
                    }

                    $dbconn->delete("Email_Address", "WHERE personId='$personId'");

                    if (isset($personalInfo["email_addresses"]) && count($personalInfo["email_addresses"]) > 0)
                    {
                        foreach ($personalInfo["email_addresses"] as $email_address)
                        {
                            $fieldStr = '(email_address, personId)';
                            $valueStr = "('$email_address', '$personId')";

                            $dbResults = $dbconn->select('Email_Address', 'personId', "WHERE email_address='" . $email_address . "'");

                            if (is_null($dbconn->lastException))
                            {
                                if (count($dbResults) == 0)
                                {
                                    $dbconn->insert('Email_Address', $fieldStr, $valueStr);
    
                                    if (!is_null($dbconn->lastException))
                                    {
                                        echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                        return;
                                    }    
                                }
                            }
                            else
                            {
                                echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                return;
                            }    
                        }
                    }

                    $dbconn->delete("Contact_Number", "WHERE personId='$personId'");

                    if (isset($personalInfo["contact_numbers"]) && count($personalInfo["contact_numbers"]) > 0)
                    {
                        foreach ($personalInfo["contact_numbers"] as $contact_number)
                        {
                            $fieldStr = '(contact_number, personId)';
                            $valueStr = "('$contact_number', '$personId')";

                            $dbconn->insert('Contact_Number', $fieldStr, $valueStr);
    
                            if (!is_null($dbconn->lastException))
                            {
                                echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                return;
                            }    
                        }
                    }

                    $dbconn->delete("Degree_Taken", "WHERE personId='$personId'");

                    if (isset($personalInfo["degree_taken"]) && count($personalInfo["degree_taken"]) > 0)
                    {
                        
                        foreach ($personalInfo["degree_taken"] as $degree_taken)
                        {
                            $fieldStr = '';
                            $valueStr = '';

                            foreach ($degree_taken as $key => $value)
                            {
                                $valueStr .= ($fieldStr == '' ? '' : ', ') . ($value == '' || is_null($value) ? 'NULL' : "'$value'");
                                $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;
                            }

                            $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$personId'";
                            $fieldStr .= ($fieldStr == '' ? '' : ', ') . 'personId';
        
                            $fieldStr = '(' . $fieldStr . ')';
                            $valueStr = '(' . $valueStr . ')';
        
                            $dbconn->insert('Degree_Taken', $fieldStr, $valueStr);

                            if (!is_null($dbconn->lastException))
                            {
                                echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                return;
                            }    
                        }
                    }

                    $dbconn->delete("Person_Disability", "WHERE personId='$personId'");

                    if (isset($disabilityIds))
                    {
                        foreach ($disabilityIds as $disabilityId)
                        {
                            $fieldStr = '(disabilityId, personId)';
                            $valueStr = "('$disabilityId', '$personId')";

                            $dbconn->insert('Person_Disability', $fieldStr, $valueStr);
    
                            if (!is_null($dbconn->lastException))
                            {
                                echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                                return;
                            }
                        }
                    }

                    $fieldStr = '';
                    $valueStr = '';
                    $fieldValueStr = '';
                    
                    $dbResults = $dbconn->select('Job_Application', "*" , "WHERE application_code='$applicationCode'");

                    if (is_null($dbconn->lastException) && !is_null($dbResults) && is_array($dbResults) && count($dbResults) > 0)
                    {
                        $updateJobApplication = true;
                    }

                    foreach ($jobApplication as $key => $value) {
                        if ($key != "personalInfo" && $key != "relevantEligibility" && $key != "relevantTraining" && $key != "relevantWorkExp")
                        {
                            if ($updateJobApplication)
                            {
                                $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . "$key='$value'";
                            }
                            else
                            {
                                $valueStr .= ($fieldStr == '' ? '' : ', ') . ($value == '' || is_null($value) ? 'NULL' : "'$value'");
                                $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;
                            }
                        }
                    }

                    if ($updateJobApplication)
                    {
                        $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . "personId=$personId";

                        $dbconn->update('Job_Application', $fieldValueStr, "WHERE application_code='$applicationCode'");
                    }
                    else
                    {
                        $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$personId'";
                        $fieldStr .= ($fieldStr == '' ? '' : ', ') . 'personId';
    
                        $fieldStr = '(' . $fieldStr . ')';
                        $valueStr = '(' . $valueStr . ')';
    
                        $dbconn->insert('Job_Application', $fieldStr, $valueStr);
                    }
                    
                    if (!is_null($dbconn->lastException))
                    {
                        echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                        return;
                    }

                    $dbconn->delete("Relevant_Training", "WHERE application_code='$applicationCode'");

                    foreach ($jobApplication["relevantTraining"] as $relevantTraining) {
                        $fieldStr = '';
                        $valueStr = '';
                        
                        foreach ($relevantTraining as $key => $value) {
                            $valueStr .= ($fieldStr == '' ? '' : ', ') . ($value == '' || is_null($value) ? 'NULL' : "'$value'");
                            $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;   
                        }

                        $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$applicationCode'";
                        $fieldStr .= ($fieldStr == '' ? '' : ', ') . 'application_code';

                        $fieldStr = '(' . $fieldStr . ')';
                        $valueStr = '(' . $valueStr . ')';
    
                        $dbconn->insert('Relevant_Training', $fieldStr, $valueStr);
        
                        if (!is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                            return;
                        }
                    }

                    $dbconn->delete("Relevant_Work_Experience", "WHERE application_code='$applicationCode'");
                    
                    foreach ($jobApplication["relevantWorkExp"] as $relevantWorkExp) {
                        $fieldStr = '';
                        $valueStr = '';
                        
                        foreach ($relevantWorkExp as $key => $value) {
                            $valueStr .= ($fieldStr == '' ? '' : ', ') . ($value == '' || is_null($value) ? 'NULL' : "'$value'");
                            $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;
                        }
                        $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$applicationCode'";
                        $fieldStr .= ($fieldStr == '' ? '' : ', ') . 'application_code';

                        $fieldStr = '(' . $fieldStr . ')';
                        $valueStr = '(' . $valueStr . ')';

                        $dbconn->insert('Relevant_Work_Experience', $fieldStr, $valueStr);
        
                        if (!is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                            return;
                        }
                    }

                    $dbconn->delete("Relevant_Eligibility", "WHERE application_code='$applicationCode'");
                    
                    foreach ($jobApplication["relevantEligibility"] as $value) {
                        $fieldStr = '';
                        $valueStr = '';

                        $valueStr .= ($fieldStr == '' ? '' : ', ') . ($value == '' || is_null($value) ? 'NULL' : "'$value'");
                        $fieldStr .= ($fieldStr == '' ? '' : ', ') . 'eligibilityId';
    
                        $valueStr .= ($fieldStr == '' ? '' : ', ') . "'$applicationCode'";
                        $fieldStr .= ($fieldStr == '' ? '' : ', ') . 'application_code';
    
                        $fieldStr = '(' . $fieldStr . ')';
                        $valueStr = '(' . $valueStr . ')';
    
                        $dbconn->insert('Relevant_Eligibility', $fieldStr, $valueStr);

                        if (!is_null($dbconn->lastException))
                        {
                            echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
                            return;
                        }
                    }
    
                    logAction('mpasis', ($updateJobApplication ? 8 : 6), array(
                        ($_SESSION['user']['is_temporary_user'] ? 'temp_' : '') . 'username'=>$_SESSION['user']['username'],
                        'application_code'=>$applicationCode,
                        'position_title'=>$jobApplication['position_title_applied']
                    ));
                    
                    echo(json_encode(new ajaxResponse('Success', 'Application has been successfully saved with <b>Application Code: ' . $applicationCode . '</b>.')));
                    return;
                }
                elseif (isset($_REQUEST['user']))
                {
                    echo(addUser($dbconn, json_decode($_REQUEST['user'], true), json_decode($_REQUEST['person'], true)));
                    return;
                }
                break;
            case 'update':
                if (isset($_REQUEST['jobApplication']))
                {
                    $jobApplication = json_decode($_REQUEST['jobApplication'], true);
                    $applicationCode = $jobApplication['application_code'];

                    $fieldValueStr = '';

                    foreach ($jobApplication as $key => $value)
                    {
                        switch ($key)
                        {
                            case 'applicant_name':
                            case 'application_code':
                            case 'position_title_applied':
                                // do nothing
                                break;
                            default:
                                $fieldValueStr .= (trim($fieldValueStr) == '' ? '' : ', ') . $key . '=' . (is_null($value) || $value == '' ? 'NULL' : "'$value'") . '';
                                break;
                        }
                    }

                    // echo(json_encode(new ajaxResponse('Success', $applicationCode)));
                    // return;

                    $dbconn->update('Job_Application', $fieldValueStr, "WHERE application_code='$applicationCode'");

                    if (is_null($dbconn->lastException))
                    {
                        logAction('mpasis', 8, array(
                            ($_SESSION['user']['is_temporary_user'] ? 'temp_' : '') . 'username'=>$_SESSION['user']['username'],
                            'application_code'=>$applicationCode,
                            'position_title'=>$jobApplication['position_title_applied']
                        ));
                        echo(json_encode(new ajaxResponse('Success', "Application Code: $applicationCode has been successfully updated!")));
                        return;
                    }
                    else
                    {
                        echo(json_encode(new ajaxResponse('Error', 'Exception encountered while inserting temporary user details')));
                        return;
                    }
                }
                elseif (isset($_REQUEST['user']))
                {
                    echo(updateUser($dbconn, json_decode($_REQUEST['user'], true), json_decode($_REQUEST['person'], true)));
                }
                elseif (isset($_REQUEST['passd']))
                {
                    echo(changePassword($dbconn, json_decode($_REQUEST['passd'], true)));
                }
                return;
                break;
            case 'delete':
                if (isset($_REQUEST['username']) && isset($_REQUEST['temp_user']))
                {
                    
                    $username = $_REQUEST['username'];
                    $isTempUser = $_REQUEST['temp_user'];
                    $user = null;

                    if ($_SESSION['user']['username'] == $username)
                    {
                        die(json_encode(new ajaxResponse('Error', 'A user cannot delete own account')));
                    }
                    
                    $user = fetchUser($dbconn, $username)[0];
                    
                    if ($isTempUser)
                    {
                        $dbconn->delete('Person', 'WHERE personId=\'' . $user['personId'] . '\'');
                    }
                    else
                    {
                        $dbconn->delete('User', "WHERE username='$username'");
                    }

                    if (is_null($dbconn->lastException))
                    {
                        echo(json_encode(new ajaxResponse('Success', 'User: ' . $_REQUEST['username'] . ' has been deleted.')));
                    }
                    else
                    {
                        echo(json_encode(new ajaxResponse('Error', 'Deletion of user: ' . $_REQUEST['username'] . ' failed.')));
                    }
                }
                return;
                break;
            case 'addTempUser':
                $person = json_decode($_REQUEST['person'], true);
                $tempUser = json_decode($_REQUEST['tempUser'], true);

                if (isset($person['given_name']))
                {
                    $fieldStr = '';
                    $valueStr = '';

                    foreach ($person as $key => $value) {
                        $valueStr .= (trim($fieldStr) == '' ? '': ', ') . "'$value'";
                        $fieldStr .= (trim($fieldStr) == '' ? '': ', ') . $key;
                    }

                    $personId = $dbconn->insert('Person', "($fieldStr)", "($valueStr)");
                    // $personId = 1;

                    if (is_null($dbconn->lastException))
                    {
                        if (isset($tempUser['username']))
                        {
                            $fieldStr = '';
                            $valueStr = '';
                            
                            $tempUser['personId'] = $personId;

                            if (isset($tempUser['password']))
                            {
                                $tempUser['password'] = trim(hash('ripemd320', $tempUser['password']));
                            }

                            foreach ($tempUser as $key => $value) {
                                $valueStr .= (trim($fieldStr) == '' ? '': ', ') . "'$value'";
                                $fieldStr .= (trim($fieldStr) == '' ? '': ', ') . $key;
                            }

                            $dbconn->insert('Temp_User', "($fieldStr)", "($valueStr)");

                            if (is_null($dbconn->lastException))
                            {
                                logAction('mpasis', 16, array(
                                    ($_SESSION['user']["is_temporary_user"] ? 'temp_' : '') . "username"=>$_SESSION['user']['username'],
                                    "temp_username_op"=>$tempUser['username']
                                ));
                                echo(json_encode(new ajaxResponse('Success', 'Temporary User successfully created')));
                                return;
                            }
                            else
                            {
                                echo(json_encode(new ajaxResponse('Error', 'Exception encountered while inserting temporary user details')));
                                return;
                            }
                        }
                        else
                        {
                            echo(json_encode(new ajaxResponse('Error', 'Username is required')));
                            return;
                        }
                    }
                    else
                    {
                        echo(json_encode(new ajaxResponse('Error', 'Exception encountered while inserting personal details')));
                        return;
                    }
                }
                else
                {
                    echo(json_encode(new ajaxResponse('Error', 'Given Name is required')));
                    return;
                }

                break;
            case 'getSalaryFromSG':
                $salaryGrade = $_REQUEST['sg'];

                $dbResults = $dbconn->select('Salary_Table', 'salary', 'WHERE salary_grade="' . $salaryGrade . '" AND step_increment=1 AND effectivity_date="2023/1/1"');
                
                if (is_null($dbconn->lastException))
                {
                    echo(json_encode(new ajaxResponse('Salary', $dbResults[0]['salary'])));
                    return;
                }
                else
                {
                    echo(json_encode(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
                    return;
                }

                break;
        }
    }
}
else // NOT SIGNED-IN
{
    echo(json_encode(new ajaxResponse('Error', 'Session has expired or was disconnected. Please refresh to sign in again.<br><br>Server Request: ' . json_encode($_REQUEST))));    
    return;
}

echo(json_encode(new ajaxResponse('Error', 'Unknown query.<br><br>Server Request: ' . json_encode($_REQUEST))));
?>