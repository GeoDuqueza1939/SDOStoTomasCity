<?php E_STRICT;
session_start();

class ajaxResponse_Extra implements JsonSerializable
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
	
	// override to allow json_encode_ex() to convert an instance of this class
	//public function jsonSerialize () : mixed
	#[\ReturnTypeWillChange]
	public function jsonSerialize ()
	{ 
		return $this->to_array();
    }
};

function utf8ize($mixed) {
    if (is_array($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed[$key] = utf8ize($value);
        }
    } elseif (is_object($mixed)) {
        foreach ($mixed as $key => $value) {
            $mixed->$key = utf8ize($value);
        }
    } elseif (is_string($mixed)) {
        // Convert to UTF-8 if not already
        if (!mb_check_encoding($mixed, 'UTF-8')) {
            return mb_convert_encoding($mixed, 'UTF-8', 'auto');
        }
    }
    return $mixed;
}

function json_encode_ex($ajaxData)
{
    $ajaxData = utf8ize($ajaxData);
    $json = json_encode($ajaxData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);

    return ($json === false ? json_encode(new ajaxResponse('Error', json_last_error_msg())) : $json);
}

require_once('../../path.php');

require_once(__FILE_ROOT__ . '/php/classes/db.php');
require_once(__FILE_ROOT__ . '/php/secure/dbcreds.php');
require_once(__FILE_ROOT__ . '/php/audit/log.php');
require_once(__FILE_ROOT__ . '/php/secure/validateUser.php');

function sendDebug($data)
{
    echo(json_encode_ex(new ajaxResponse('Debug', json_encode_ex($data))));
    exit;
}

function selectJobApplications(DatabaseConnection $dbconn, $where = "", $limit = null, $isDebug = false) // return a json_encode_exd ajaxResponse; $where can be a string of colname='value' or colname LIKE 'value' pairs
{
    global $dbname;

    $query = "SELECT
        application_code,
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
        position_title_applied,
        parenthetical_title_applied,
        plantilla_item_number_applied,
        present_school,
        present_district,
        present_position,
        present_designation,
        has_specific_education_required,
        educ_notes,
        has_specific_training,
        has_more_unrecorded_training,
        train_notes,
        has_specific_work_experience,
        has_more_unrecorded_work_experience,
        work_exp_notes,
        has_specific_competency_required,
        most_recent_performance_rating,
        performance_cse_gwa_rating,
        performance_cse_honor_grad,
        performance_notes,
        lept_rating,
        lept_notes,
        ppstcoi,
        coi_notes,
        ppstncoi,
        ncoi_notes,
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
        trainer_award_level,
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
        accomplishments_notes,
        number_of_app_educ_r_actionplan,
        number_of_app_educ_r_actionplan_ar,
        number_of_app_educ_r_actionplan_ar_adoption,
        number_of_app_educ_nr_actionplan,
        number_of_app_educ_nr_actionplan_ar,
        number_of_app_educ_nr_actionplan_ar_adoption,
        app_educ_gwa,
        education_app_notes,
        number_of_app_train_relevant_cert_ap,
        number_of_app_train_relevant_cert_ap_arlocal,
        number_of_app_train_relevant_cert_ap_arlocal_arother,
        number_of_app_train_not_relevant_cert_ap,
        number_of_app_train_not_relevant_cert_ap_arlocal,
        number_of_app_train_not_relevant_cert_ap_arlocal_arother,
        training_app_notes,
        score_exam,
        score_skill,
        score_bei,
        potential_notes,
        is_solo_parent,
        include_in_ier,
        has_attended_open_ranking,
        include_in_car,
        remarks
    FROM `$dbname`.Person pe
    INNER JOIN `$dbname`.Job_Application ja ON ja.personId = pe.personId
    LEFT JOIN `$dbname`.ENUM_Educational_Attainment eea ON pe.educational_attainment = eea.index
    LEFT JOIN `$dbname`.ENUM_Civil_Status ecs ON pe.civil_status = ecs.index
    LEFT JOIN `$dbname`.Religion r ON pe.religionId = r.religionId
    LEFT JOIN `$dbname`.Ethnicity eth ON pe.ethnicityId = eth.ethnicityId
    LEFT JOIN `$dbname`.Address presAdd ON pe.present_addressId = presAdd.addressId
    LEFT JOIN `$dbname`.Address permAdd ON pe.permanent_addressId = permAdd.addressId"
    . (is_null($where) || (is_string($where) && trim($where) == "") ? "" : " WHERE $where")
    . (is_null($limit) || !is_numeric($limit) ? "" : " LIMIT $limit");
    
    $dbResults = $dbconn->executeQuery($query);
    // --has_alternative_work_experience_applicable,
    // --alternative_work_experience_years,

    // return (json_encode_ex_ex(new ajaxResponse('Data', $dbResults)));

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
                return json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->executeQuery("SELECT person_disabilityId, pd.disabilityId as disabilityId, disability FROM Disability d INNER JOIN Person_Disability pd ON d.disabilityId=pd.disabilityId WHERE personId='" . $dbResults[$i]['personId'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['disability'] = $dbResults2;
            }
            else
            {
                return json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->select("Email_Address", "email_address", "WHERE personId='" . $dbResults[$i]['personId'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['email_address'] = $dbResults2;
            }
            else
            {
                return json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->select("Contact_Number", "contact_numberId, contact_number", "WHERE personId='" . $dbResults[$i]['personId'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['contact_number'] = $dbResults2;
            }
            else
            {
                return json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->select("Relevant_Training", "relevant_trainingId, descriptive_name, hours", "WHERE application_code='" . $dbResults[$i]['application_code'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['relevant_training'] = $dbResults2;
            }
            else
            {
                return json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults2 = $dbconn->select("Relevant_Work_Experience", "relevant_work_experienceId, descriptive_name, start_date, end_date", "WHERE application_code='" . $dbResults[$i]['application_code'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['relevant_work_experience'] = $dbResults2;
            }
            else
            {
                return json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            // $dbResults2 = $dbconn->select("Relevant_Eligibility", "relevant_eligibilityId, eligibilityId", "WHERE application_code='" . $dbResults[$i]['application_code'] . "'");
            $dbResults2 = $dbconn->executeQuery("SELECT relevant_eligibilityId, Relevant_Eligibility.eligibilityId, eligibility, eligibility_abbrev FROM Relevant_Eligibility INNER JOIN Eligibility ON Relevant_Eligibility.eligibilityId=Eligibility.eligibilityId WHERE application_code='" . $dbResults[$i]['application_code'] . "'");

            if (is_null($dbconn->lastException))
            {
                $dbResults[$i]['relevant_eligibility'] = $dbResults2;
            }
            else
            {
                return json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
            }

            $dbResults[$i]['application_history'] = dbRetrieveJobApplicationHistory($dbconn, $dbResults[$i]['application_code'], false);
        }

        return json_encode_ex(new ajaxResponse(($isDebug ? 'Debug' : 'Data'), json_encode_ex($dbResults)));
    }
        
    return json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage()));
}

function selectRecordAllColumns(DatabaseConnection $dbconn, $tableName) // CANNOT USE JOINS!!!
{
    $dbResults = $dbconn->select($tableName, '*', '');
    
    if (is_null($dbconn->lastException))
    {
        return json_encode_ex(new ajaxResponse('Data', json_encode_ex($dbResults)));
    }
    else
    {
        die(json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage())));
    }
}

function generateFieldValueStr($dbconn, $valuesArr, &$fieldStr, &$valueStr, $filterFunc = null) // does not include parenthesis; also returns a string of field='value' pairs delimited by commas
{
    $fieldValueStr = '';
    $fieldStr = '';
    $valueStr = '';

    if (is_null($filterFunc) || !is_callable($filterFunc))
    {
        $filterFunc = function($a, $k, $v) {return true;};
    }

    foreach ($valuesArr as $key=>$value)
    {
        if ($filterFunc($valuesArr, $key, $value))
        {
            // $valueStr .= ($fieldStr == '' ? '' : ', ') . (is_string($value) && $value !== '' ? "'" : '') . ($value == '' || is_null($value) ? 'NULL' : $dbconn->getConn()->quote($value)) . (is_string($value) && $value !== '' ? "'" : '');
            $valueStr .= ($fieldStr == '' ? '' : ', ') . ($value == '' || is_null($value) ? 'NULL' : $dbconn->getConn()->quote($value));
            $fieldStr .= ($fieldStr == '' ? '' : ', ') . $key;
            // $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . $key .'=' . (is_string($value) && $value !== '' ? "'" : '') . ($value == '' || is_null($value) ? 'NULL' : $dbconn->getConn()->quote($value)) . (is_string($value) && $value !== '' ? "'" : '');
            $fieldValueStr .= ($fieldValueStr == '' ? '' : ', ') . $key .'=' . ($value == '' || is_null($value) ? 'NULL' : $dbconn->getConn()->quote($value));
        }
    }

    return $fieldValueStr;
}

function dbRetrieveJobApplicationHistory($dbconn, $applicationCode, $encode = true)
{
    $applicationHistory = [];

    if (is_null($applicationCode) || trim($applicationCode) == '')
    {
        echo(json_encode_ex(new ajaxResponse('Error', 'Application code cannot be blank or NULL')));
        return false;
    }

    $applicationHistory = $dbconn->select('MPASIS_History', '*', 'WHERE application_code = "' . $applicationCode . '" OR remarks LIKE "' . $applicationCode . '"');

    if (is_null($dbconn->lastException))
    {
        if (count($applicationHistory) == 0)
        {
            // No history found, so DO NOTHING
        }
    }
    else
    {
        echo(json_encode_ex(new ajaxResponse('Error', $dbconn->lastException->getMessage() . '<br><br>Last SQL Statement: ' . $dbconn->lastSQLStr)));
        return false;
    }

    return ($encode ? json_encode_ex(new ajaxResponse('Data', json_encode_ex($applicationHistory))) : $applicationHistory);
}

function getCriteria($positionObj, $jobApplication = []) 
{
    global $educIncrementTable;
    $positionTitle = $positionObj["position_title"];
    $salaryGrade = $positionObj["salary_grade"];
    $positionCategory = $positionObj["position_categoryId"];
    $positionRequiresExp = ($positionObj["required_work_experience_years"] > 0);
    $applicantHasPriorWorkExp = (isset($jobApplication["relevant_work_experience"]) ? count($jobApplication["relevant_work_experience"]) > 0 : false);
    $defaultEndDate = "2024-05-16";

    $criteria = [
        [
            "id"=>"summary",
            "type"=>"summary",
            "label"=>"Summary of Ratings",
            "dbColName"=>"summary",
            "dbTableName"=>"",
            "content"=>[
                ["id"=>"summary_criteria","type"=>"summary-header","label"=>"Criteria","dbColName"=>"summary_criteria","dbTableName"=>"","content"=>[],"parentId"=>"summary","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"summary_weight","type"=>"summary-header","label"=>"Weight","dbColName"=>"summary_weight","dbTableName"=>"","content"=>[],"parentId"=>"summary","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"summary_score","type"=>"summary-header","label"=>"Score","dbColName"=>"summary_score","dbTableName"=>"","content"=>[],"parentId"=>"summary","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"summary_total_label","type"=>"summary-footer","label"=>"Grand Total:","dbColName"=>"summary_total_label","dbTableName"=>"","content"=>[],"parentId"=>"summary","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"summary_total_weight","type"=>"summary-footer","label"=>"0%","dbColName"=>"summary_total_weight","dbTableName"=>"","content"=>[],"parentId"=>"summary","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"summary_total_score","type"=>"summary-footer","label"=>"0.000","dbColName"=>"summary_total_score","dbTableName"=>"","content"=>[],"parentId"=>"summary","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>-1,
            "maxPoints"=>0,
            "min"=>0,
            "max"=>0,
            "step"=>0
        ],
        [
            "id"=>"education",
            "type"=>"criteria1",
            "label"=>"Education",
            "dbColName"=>"education",
            "dbTableName"=>"",
            "content"=>[
                ["id"=>"educational_attainment","type"=>"display","label"=>"Highest level of education attained","dbColName"=>"educational_attainment","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"degrees_taken","type"=>"display-list-bullet-disc","label"=>"Degrees taken","dbColName"=>"degrees_taken","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"has_specific_education_required","type"=>"display","label"=>"Has taken education required for the position","dbColName"=>"has_specific_education_required","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"educ_notes","type"=>"display","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"educ_notes","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"educIncrementsApplicant","type"=>"display","label"=>"Applicant's education increment level","dbColName"=>"educIncrementsApplicant","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"educIncrementsQS","type"=>"display","label"=>"Base increment level (Qualification Standard)","dbColName"=>"educIncrementsQS","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"educIncrements","type"=>"display","label"=>"Number of increments above the Qualification Standard","dbColName"=>"educIncrements","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"isEducQualified","type"=>"display-check","label"=>"Applicant is qualified","dbColName"=>"isEducQualified","dbTableName"=>"","content"=>[],"parentId"=>"education","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 5 || ($positionCategory == 4 && $salaryGrade != 24) ? 5 : 10),
            "maxPoints"=>($positionCategory == 5 || ($positionCategory == 4 && $salaryGrade != 24) ? 5 : 10),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"educ_notes",
            "getPointsManually"=>function($mode = 0) use ($positionObj, $jobApplication, $educIncrementTable) {
                $score = 0;
                $scoreSheetElementUI = null;
                
                $educAttainment = $jobApplication["educational_attainmentIndex"];
                $degreeTaken = $jobApplication["degree_taken"];
                $educNotes = $jobApplication["educ_notes"] ?? "none";
                $hasSpecEduc = ($positionObj["specific_education_required"] == null ? "N/A" : ($jobApplication["has_specific_education_required"] != 0 && $jobApplication["has_specific_education_required"] != null ? "Yes" : "No"));
                
                $applicantEducIncrement = ($educAttainment == null ? 0 : getEducIncrements($educAttainment, $degreeTaken));
                
                $incrementObj = array_values(array_filter($educIncrementTable, function($increment) use ($positionObj) {
                    return $increment["baseline_educational_attainment"] == $positionObj["required_educational_attainment"];
                }));
                
                $requiredEducIncrement = $incrementObj[0]["education_increment_level"];
                $educIncrementAboveQS = $applicantEducIncrement - $requiredEducIncrement;
                
                $score = getEducScore($educIncrementAboveQS, $positionObj["position_categoryId"], $positionObj["salary_grade"]);
                
                return $score;
            }
        ],
        [
            "id"=>"training",
            "type"=>"criteria1",
            "label"=>"Training",
            "dbColName"=>"training",
            "dbTableName"=>"",
            "content"=>[
                ["id"=>"relevant_training_hours","type"=>"display","label"=>"Total number of relevant training hours","dbColName"=>"relevant_training_hours","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"relevant_training_count","type"=>"display","label"=>"Number of relevant trainings considered","dbColName"=>"relevant_training_count","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"has_specific_training","type"=>"display","label"=>"Has undergone required training for the position","dbColName"=>"has_specific_training","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"has_more_unrecorded_training","type"=>"display","label"=>"Has unconsidered trainings","dbColName"=>"has_more_unrecorded_training","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"train_notes","type"=>"display","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"train_notes","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"trainIncrementsApplicant","type"=>"display","label"=>"Applicant's training increment level","dbColName"=>"trainIncrementsApplicant","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"trainIncrementsQS","type"=>"display","label"=>"Base increment level (Qualification Standard)","dbColName"=>"trainIncrementsQS","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"trainIncrements","type"=>"display","label"=>"Number of increments above the Qualification Standard","dbColName"=>"trainIncrements","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"isTrainingQualified","type"=>"display-check","label"=>"Applicant is qualified","dbColName"=>"isTrainingQualified","dbTableName"=>"","content"=>[],"parentId"=>"training","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 5 || ($positionCategory == 4 && ($salaryGrade <= 9 || $salaryGrade == 24)) ? 5 : 10),
            "maxPoints"=>($positionCategory == 5 || ($positionCategory == 4 && ($salaryGrade <= 9 || $salaryGrade == 24)) ? 5 : 10),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"train_notes",
            "getPointsManually"=>function($mode = 0) use ($positionObj, $jobApplication) {
                $score = 0;
                $scoreSheetElementUI = null;
                
                $relevantTrainings = $jobApplication["relevant_training"];
                $trainNotes = $jobApplication["train_notes"] ?? "none";
                $relevantTrainingHours = (count($relevantTrainings) > 0 ? array_sum(array_column($relevantTrainings, 'hours')) : 0);
                $applicantTrainingIncrement = floor($relevantTrainingHours / 8) + 1;
                $hasSpecTraining = ($positionObj["specific_training_required"] == null ? "N/A" : ($jobApplication["has_specific_training"] != 0 && $jobApplication["has_specific_training"] != null ? "Yes" : "No"));
                $hasMoreTraining = ($jobApplication["has_more_unrecorded_training"] == null ? "N/A" : ($jobApplication["has_more_unrecorded_training"] == 1 ? "Yes" : "No"));
                $requiredTrainingHours = $positionObj["required_training_hours"];
                $requiredTrainingIncrement = floor($requiredTrainingHours / 8) + 1;
                $trainingIncrementAboveQS = $applicantTrainingIncrement - $requiredTrainingIncrement;

                $score = getTrainingScore($trainingIncrementAboveQS, $positionObj["position_categoryId"], $positionObj["salary_grade"]);
                
                return $score;
            }
        ],
        [
            "id"=>"experience",
            "type"=>"criteria1",
            "label"=>"Experience",
            "dbColName"=>"experience",
            "dbTableName"=>"",
            "content"=>[
                ["id"=>"relevant_work_experience_years","type"=>"display","label"=>"Total number of years of relevant work experience","dbColName"=>"relevant_work_experience_years","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"relevant_work_experience_count","type"=>"display","label"=>"Number of relevant employment considered","dbColName"=>"relevant_work_experience_count","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"has_specific_work_experience","type"=>"display","label"=>"Has the required work experience for the position","dbColName"=>"has_specific_work_experience","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"has_more_unrecorded_work_experience","type"=>"display","label"=>"Has unconsidered employment","dbColName"=>"has_more_unrecorded_work_experience","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"work_exp_notes","type"=>"display","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"work_exp_notes","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"expIncrementsApplicant","type"=>"display","label"=>"Applicant's work experience increment level","dbColName"=>"expIncrementsApplicant","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"expIncrementsQS","type"=>"display","label"=>"Base increment level (Qualification Standard)","dbColName"=>"expIncrementsQS","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"expIncrements","type"=>"display","label"=>"Number of increments above the Qualification Standard","dbColName"=>"expIncrements","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"isWorkExpQualified","type"=>"display-check","label"=>"Applicant is qualified","dbColName"=>"isWorkExpQualified","dbTableName"=>"","content"=>[],"parentId"=>"experience","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory > 3 ? ($salaryGrade > 9 ? 15 : 20) : 10),
            "maxPoints"=>($positionCategory > 3 ? ($salaryGrade > 9 ? 15 : 20) : 10),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"work_exp_notes",
            "getPointsManually"=>function($mode = 0) use ($positionObj, $jobApplication, $defaultEndDate) {
                $score = 0;
                $scoreSheetElementUI = null;

                $relevantWorkExp = $jobApplication["relevant_work_experience"];
                $workExpNotes = $jobApplication["work_exp_notes"] ?? "none";
                $relevantWorkExpDuration = (count($relevantWorkExp) > 0 ? array_reduce(array_map(function($workExp) use ($defaultEndDate) {
                    return getDuration($workExp["start_date"], ($workExp["end_date"] == null || $workExp["end_date"] == "" ? $defaultEndDate : $workExp["end_date"]));
                }, $relevantWorkExp), 'addDuration') : ["y"=>0, "m"=>0, "d"=>0]);    
                $applicantWorkExpIncrement = floor(convertDurationToNum($relevantWorkExpDuration) * 12 / 6 + 1);
                $hasSpecWorkExp = ($positionObj["specific_work_experience_required"] == null ? "N/A" : ($jobApplication["has_specific_work_experience"] != 0 && $jobApplication["has_specific_work_experience"] != null ? "Yes" : "No"));
                $hasMoreWorkExp = ($jobApplication["has_more_unrecorded_work_experience"] == null ? "N/A" : ($jobApplication["has_more_unrecorded_work_experience"] == 1 ? "Yes" : "No"));
                $requiredWorkExpYears = $positionObj["required_work_experience_years"];
                $requiredWorkExpIncrement = floor($requiredWorkExpYears * 12 / 6 + 1);
                $workExpIncrementAboveQS = $applicantWorkExpIncrement - $requiredWorkExpIncrement;
                    
                $score = getWorkExpScore($workExpIncrementAboveQS, $positionObj["position_categoryId"], $positionObj["salary_grade"]);

                return $score;
            }
        ],
        [
            "id"=>"performance",
            "type"=>"criteria1",
            "label"=>"Performance",
            "dbColName"=>"performance",
            "dbTableName"=>"",
            "content"=>[
                ["id"=>"position_req_work_exp","type"=>"display-check","label"=>"Position applied requires prior work experience (non-entry level)","dbColName"=>"position_req_work_exp","dbTableName"=>"","content"=>[],"parentId"=>"performance","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"applicant_has_prior_exp","type"=>"display-check","label"=>"Applicant has prior work experience","dbColName"=>"applicant_has_prior_exp","dbTableName"=>"","content"=>[],"parentId"=>"performance","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"performance","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"most_recent_performance_rating","type"=>"input-number","label"=>"Most recent relevant 1-year Performance Rating attained","shortLabel"=>"Perf. Rating","dbColName"=>"most_recent_performance_rating","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"performance","score"=>1,"weight"=>(($positionCategory == 1 && $salaryGrade == 11) || !($positionRequiresExp || $applicantHasPriorWorkExp) ? 0 : ($positionCategory == 1 ? 30 : ($positionCategory == 5 ? 10 : ($positionCategory == 2 || $positionCategory == 3 && $salaryGrade == 24 ? 25 : 20)))),"maxPoints"=>0,"min"=>0,"max"=>5,"step"=>0.1],
                ["id"=>"performance_cse_gwa_rating","type"=>"input-number","label"=>"CSE Rating/GWA in the highest academic/grade level earned (actual/equivalent)", "shortLabel"=>"CSE Rating/GWA","dbColName"=>"performance_cse_gwa_rating","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"performance","score"=>1,"weight"=>($positionCategory == 1 || $positionRequiresExp || $applicantHasPriorWorkExp ? 0 : ($positionCategory == 5 ? 10 : ($positionCategory == 2 || $positionCategory == 3 && $salaryGrade == 24 ? 25 : 20))),"maxPoints"=>0,"min"=>0,"max"=>100,"step"=>0.1,"getPointsManually"=>function($mode = 0) use ($jobApplication, $positionCategory, $positionRequiresExp, $applicantHasPriorWorkExp, $salaryGrade) {
                        $score = 1;
                        $weight = ($positionCategory == 1 || $positionRequiresExp || $applicantHasPriorWorkExp ? 0 : ($positionCategory == 5 ? 10 : ($positionCategory == 2 || $positionCategory == 3 && $salaryGrade == 24 ? 25 : 20)));
                        $max = 100;

                        $value = $jobApplication['performance_cse_gwa_rating'];
                
                        return $score * $value / ($weight <= 0 ? 1 : $max / $weight);
                    }
                ],
                [
                    "id"=>"performance_cse_honor_grad",
                    "type"=>"input-radio-select",
                    "tooltip"=>"Please select the applicable item if applicant is an honor graduate",
                    "label"=>"Honor Grad.",
                    "dbColName"=>"performance_cse_honor_grad",
                    "dbTableName"=>"Job_Application",
                    "content"=>[
                        ["id"=>"","type"=>"input-list-item","label"=>"None","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"performance_cse_honor_grad","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                        ["id"=>"","type"=>"input-list-item","label"=>"Cum Laude","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"performance_cse_honor_grad","score"=>18,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                        ["id"=>"","type"=>"input-list-item","label"=>"Magna Cum Laude","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"performance_cse_honor_grad","score"=>19,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                        ["id"=>"","type"=>"input-list-item","label"=>"Summa Cum Laude","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"performance_cse_honor_grad","score"=>20,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
                    ],
                    "parentId"=>"performance",
                    "score"=>1,
                    "weight"=>($positionCategory == 1 || $positionRequiresExp || $applicantHasPriorWorkExp ? 0 : ($positionCategory == 5 ? 10 : ($positionCategory == 2 || $positionCategory == 3 && $salaryGrade == 24 ? 25 : 20))),
                    "maxPoints"=>0,
                    "min"=>0,
                    "max"=>20,
                    "step"=>0,
                    "getPointsManually"=>function($mode = 0) use ($jobApplication, $positionCategory, $positionRequiresExp, $applicantHasPriorWorkExp, $salaryGrade) {
                        $value = $jobApplication['performance_cse_honor_grad'];
                        $score = 1;
                        $weight = ($positionCategory == 1 || $positionRequiresExp || $applicantHasPriorWorkExp ? 0 : ($positionCategory == 5 ? 10 : ($positionCategory == 2 || $positionCategory == 3 && $salaryGrade == 24 ? 25 : 20)));
                        $max = 20;

                        return $score * $value / ($weight <= 0 ? 1 : $max / $weight);
                    }
                ],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"performance","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"performance_notes","type"=>"textarea","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"performance_notes","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"performance","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 30 : 0) : ($positionCategory == 5 ? 10 : ($positionCategory == 2 || $positionCategory == 3 && $salaryGrade == 24 ? 25 : 20))),
            "maxPoints"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 30 : 0) : ($positionCategory == 5 ? 10 : ($positionCategory == 2 || $positionCategory == 3 && $salaryGrade == 24 ? 25 : 20))),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"performance_notes"
        ],
        [
            "id"=>"lept",
            "type"=>"criteria1",
            "label"=>"PBET/LET/LEPT Rating",
            "dbColName"=>"lept",
            "dbTableName"=>"",
            "content"=>[
                ["id"=>"lept_rating","type"=>"input-number","label"=>"Applicant's PBET/LET/LEPT Rating","shortLabel"=>"LEPT Rating","dbColName"=>"lept_rating","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"lept","score"=>1,"weight"=>($positionCategory == 1 ? 10 : 0),"maxPoints"=>0,"min"=>0,"max"=>100,"step"=>0.1],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"lept","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"lept_notes","type"=>"textarea","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"lept_notes","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"lept","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 1 && $salaryGrade == 11 ? 10 : 0),
            "maxPoints"=>($positionCategory == 1 && $salaryGrade == 11 ? 10 : 0),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"lept_notes"
        ],
        [
            "id"=>"coi",
            "type"=>"criteria1",
            "label"=>"PPST Classroom Observable Indicators",
            "sublabel"=>"Demonstration Teaching using COT-RSP",
            "dbColName"=>"coi",
            "dbTableName"=>"",
            "content"=>[
                ["id"=>"ppstcoi","type"=>"input-number","label"=>"Applicant's COT Rating (raw score)","shortLabel"=>"COT Rating","dbColName"=>"ppstcoi","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"coi","score"=>1,"weight"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 25 : 35) : 0),"maxPoints"=>0,"min"=>0,"max"=>(5 * ($salaryGrade < 12 ? 6 : ($salaryGrade < 14 ? 6 : ($salaryGrade < 18 ? 7 : ($salaryGrade < 20 ? 8 : 9))))),"step"=>0.1],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"coi","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"coi_notes","type"=>"textarea","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"coi_notes","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"coi","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 25 : 35) : 0),
            "maxPoints"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 25 : 35) : 0),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"coi_notes"
        ],
        [
            "id"=>"ncoi",
            "type"=>"criteria1",
            "label"=>"PPST Non-Classroom Observable Indicators",
            "sublabel"=>"Teacher Reflection",
            "dbColName"=>"ncoi",
            "dbTableName"=>"",
            "content"=>[
                // ["id"=>"ppstncoi","type"=>"input-number","label"=>"Applicant's TRF Rating","shortLabel"=>"TRF Rating","dbColName"=>"ppstncoi","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"ncoi","score"=>1,"weight"=>($positionCategory == 1 ? 25 : 0),"maxPoints"=>0,"min"=>0,"max"=>30,"step"=>0.1], // USE THIS FOR OLDER T1 APPLICATIONS IN 2024
                ["id"=>"ppstncoi","type"=>"input-number","label"=>($salaryGrade > 11 ? "Portfolio Assessment Score" : "Applicant's TRF Rating"),"shortLabel"=>"TRF Rating","dbColName"=>"ppstncoi","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"ncoi","score"=>1,"weight"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 10 : 25) : 0),"maxPoints"=>0,"min"=>0,"max"=>($salaryGrade > 11 ? 10 : 25),"step"=>0.1],
                ["id"=>"score_bei","type"=>"input-number","label"=>"Behavioral Events Interview","shortLabel"=>"BEI","dbColName"=>"score_bei","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"ncoi","score"=>1,"weight"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 5 : 0) : 0),"maxPoints"=>0,"min"=>0,"max"=>5,"step"=>0.1],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"ncoi","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"ncoi_notes","type"=>"textarea","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"ncoi_notes","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"ncoi","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 15 : 25) : 0),
            "maxPoints"=>($positionCategory == 1 ? ($salaryGrade > 11 ? 15 : 25) : 0),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"ncoi_notes"
        ],
        [
            "id"=>"accomplishments",
            "type"=>"criteria1",
            "label"=>"Outstanding Accomplishments",
            "dbColName"=>"accomplishments",
            "dbTableName"=>"",
            "content"=>[
                [
                    "id"=>"awards",
                    "type"=>"criteria2",
                    "label"=>"Awards and Recognition",
                    "dbColName"=>"awards",
                    "dbTableName"=>"",
                    "content"=>[
                        [
                            "id"=>"citation",
                            "type"=>"criteria3",
                            "label"=>"Citation or Commendation",
                            "dbColName"=>"citation",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_citation_movs","type"=>"input-number","label"=>"Number of letters of citation/commendation presented by applicant","dbColName"=>"number_of_citation_movs","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"citation","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1,"getPointsManually"=>function($mode = 0) use ($jobApplication) {
                                    $value = $jobApplication['number_of_citation_movs'];

                                    return ($value > 2 ? 4 : ($value < 1 ? 0 : $value + 1));
                                }],
                            ],
                            "parentId"=>"awards",
                            "score"=>0,
                            "weight"=>($positionCategory > 3 ? -1 : 0),
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"academic_award",
                            "type"=>"criteria3",
                            "label"=>"Academic or Inter-School Award MOVs",
                            "dbColName"=>"academic_award",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_academic_award_movs","type"=>"input-number","label"=>"Number of award certificates/MOVs presented by applicant","dbColName"=>"number_of_academic_award_movs","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"academic_award","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1,"getPointsManually"=>function($mode = 0) use ($jobApplication){
                                    $value = $jobApplication['number_of_academic_award_movs'];

                                    return ($value > 2 ? 4 : ($value < 1 ? 0 : $value + 1));
                                }],
                            ],
                            "parentId"=>"awards",
                            "score"=>0,
                            "weight"=>($positionCategory > 2 ? -1 : 0),
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"outstanding_emp_award",
                            "type"=>"criteria3",
                            "label"=>"Outstanding Employee Award MOVs",
                            "dbColName"=>"outstanding_emp_award",
                            "dbTableName"=>"",
                            "content"=>[
                                [
                                    "id"=>"outstanding_emp_award_external",
                                    "type"=>"criteria4",
                                    "label"=>"Number of awards from external institution",
                                    "dbColName"=>"outstanding_emp_award_external",
                                    "dbTableName"=>"",
                                    "content"=>[
                                        ["id"=>"number_of_awards_external_office_search","type"=>"input-number","label"=>"Local office search","dbColName"=>"number_of_awards_external_office_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_external","score"=>($positionCategory == 3 ? 1 : 2),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                        ["id"=>"number_of_awards_external_org_level_search","type"=>"input-number","label"=>"Organization-level search or higher","dbColName"=>"number_of_awards_external_org_level_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_external","score"=>($positionCategory == 3 ? 2 : 4),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                                    ],
                                    "parentId"=>"outstanding_emp_award",
                                    "score"=>0,
                                    "weight"=>-1,
                                    "maxPoints"=>0,
                                    "min"=>0,
                                    "max"=>0,
                                    "step"=>0
                                ],    
                                [
                                    "id"=>"outstanding_emp_award_co",
                                    "type"=>"criteria4",
                                    "label"=>"Number of awards from the Central Office",
                                    "dbColName"=>"outstanding_emp_award_co",
                                    "dbTableName"=>"",
                                    "content"=>[
                                        ["id"=>"number_of_awards_central_co_level_search","type"=>"input-number","label"=>"Central Office search","dbColName"=>"number_of_awards_central_co_level_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_co","score"=>($positionCategory == 3 ? 1 : 2),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                        ["id"=>"number_of_awards_central_national_search","type"=>"input-number","label"=>"National-level search or higher","dbColName"=>"number_of_awards_central_national_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_co","score"=>($positionCategory == 3 ? 2 : 4),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                                    ],
                                    "parentId"=>"outstanding_emp_award",
                                    "score"=>0,
                                    "weight"=>-1,
                                    "maxPoints"=>0,
                                    "min"=>0,
                                    "max"=>0,
                                    "step"=>0
                                ],        
                                [
                                    "id"=>"outstanding_emp_award_ro",
                                    "type"=>"criteria4",
                                    "label"=>"Number of awards from the Regional Office",
                                    "dbColName"=>"outstanding_emp_award_ro",
                                    "dbTableName"=>"",
                                    "content"=>[
                                        ["id"=>"number_of_awards_regional_ro_level_search","type"=>"input-number","label"=>"Regional Office search","dbColName"=>"number_of_awards_regional_ro_level_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_ro","score"=>($positionCategory == 3 ? 1 : 2),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                        ["id"=>"number_of_awards_regional_national_search","type"=>"input-number","label"=>"National-level search or higher","dbColName"=>"number_of_awards_regional_national_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_ro","score"=>($positionCategory == 3 ? 2 : 4),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                                    ],"parentId"=>"outstanding_emp_award",
                                    "score"=>0,
                                    "weight"=>-1,
                                    "maxPoints"=>0,
                                    "min"=>0,
                                    "max"=>0,
                                    "step"=>0
                                ],        
                                [
                                    "id"=>"outstanding_emp_award_sdo",
                                    "type"=>"criteria4",
                                    "label"=>"Number of awards from the Schools Division Office",
                                    "dbColName"=>"outstanding_emp_award_sdo",
                                    "dbTableName"=>"",
                                    "content"=>[
                                        ["id"=>"number_of_awards_division_sdo_level_search","type"=>"input-number","label"=>"Division-/provincial-/city-level search","dbColName"=>"number_of_awards_division_sdo_level_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_sdo","score"=>($positionCategory == 3 ? 1 : 2),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                        ["id"=>"number_of_awards_division_national_search","type"=>"input-number","label"=>"Regional-level search or higher","dbColName"=>"number_of_awards_division_national_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_sdo","score"=>($positionCategory == 3 ? 2 : 4),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                                    ],
                                    "parentId"=>"outstanding_emp_award",
                                    "score"=>0,
                                    "weight"=>-1,
                                    "maxPoints"=>0,
                                    "min"=>0,
                                    "max"=>0,
                                    "step"=>0
                                ],    
                                [
                                    "id"=>"outstanding_emp_award_school",
                                    "type"=>"criteria4",
                                    "label"=>"Number of awards from schools",
                                    "dbColName"=>"outstanding_emp_award_school",
                                    "dbTableName"=>"",
                                    "content"=>[
                                        ["id"=>"number_of_awards_school_school_level_search","type"=>"input-number","label"=>"School-/municipality-/district-level search","dbColName"=>"number_of_awards_school_school_level_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_school","score"=>($positionCategory == 3 ? 1 : 2),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                        ["id"=>"number_of_awards_school_sdo_level_search","type"=>"input-number","label"=>"Division-level search or higher","dbColName"=>"number_of_awards_school_sdo_level_search","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"outstanding_emp_award_school","score"=>($positionCategory == 3 ? 2 : 4),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                                    ],
                                    "parentId"=>"outstanding_emp_award",
                                    "score"=>0,
                                    "weight"=>-1,
                                    "maxPoints"=>0,
                                    "min"=>0,
                                    "max"=>0,
                                    "step"=>0
                                ]
                            ],
                            "parentId"=>"awards",
                            "score"=>0,
                            "weight"=>($positionCategory > 1 ? -1 : 0),
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"trainer_award",
                            "type"=>"criteria3",
                            "label"=>"Awards as Trainer/Coach",
                            "dbColName"=>"trainer_award",
                            "dbTableName"=>"",
                            "content"=>[
                                [
                                    "id"=>"trainer_award_level",
                                    "type"=>"input-radio-select",
                                    "label"=>"Please select the applicant's highest level of award as a trainer or coach",
                                    "dbColName"=>"trainer_award_level",
                                    "dbTableName"=>"Job_Application",
                                    "content"=>[
                                        ["id"=>"","type"=>"input-list-item","label"=>"None","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainer_award_level","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                        ["id"=>"","type"=>"input-list-item","label"=>"Champion or Highest Placer in the Division/Provincial Level","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainer_award_level","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                        ["id"=>"","type"=>"input-list-item","label"=>"Champion or Highest Placer in the Regional Level","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainer_award_level","score"=>2,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                        ["id"=>"","type"=>"input-list-item","label"=>"Champion or Highest Placer in the National Level","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainer_award_level","score"=>3,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
                                    ],
                                    "parentId"=>"trainer_award",
                                    "score"=>1,
                                    "weight"=>-1,
                                    "maxPoints"=>0,
                                    "min"=>0,
                                    "max"=>0,
                                    "step"=>0
                                ]
                            ],
                            "parentId"=>"awards",
                            "score"=>0,
                            "weight"=>($positionCategory == 2 ? -1 : 0),
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ]
                    ],
                    "parentId"=>"accomplishments",
                    "score"=>0,
                    "weight"=>($positionCategory > 1 ? -1 : 0),
                    "maxPoints"=>($positionCategory == 1 ? 0 : ($positionCategory == 2 ? 7 : ($positionCategory == 3 ? 2 : 4))),
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                [
                    "id"=>"research",
                    "type"=>"criteria2",
                    "label"=>"Research and Innovation",
                    "dbColName"=>"research",
                    "dbTableName"=>"",
                    "content"=>[
                        [
                            "id"=>"research_guide",
                            "type"=>"display-list-upper-alpha",
                            "label"=>"Guide",
                            "dbColName"=>"",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"","type"=>"list-item","label"=>"Proposal","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"research_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"list-item","label"=>"Accomplishment Report","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"research_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"list-item","label"=>"Certification of Utilization","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"research_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"list-item","label"=>"Certification of Adoption","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"research_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"list-item","label"=>"Proof of Citation by Other Researchers","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"research_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
                            ],
                            "parentId"=>"research",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        ["id"=>"number_of_research_proposal_only","type"=>"input-number","label"=>"A only","dbColName"=>"number_of_research_proposal_only","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"research","score"=>($positionCategory == 3 ? 2 : 1),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_research_proposal_ar","type"=>"input-number","label"=>"A and B","dbColName"=>"number_of_research_proposal_ar","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"research","score"=>($positionCategory == 3 ? 3 : 2),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_research_proposal_ar_util","type"=>"input-number","label"=>"A, B, and C","dbColName"=>"number_of_research_proposal_ar_util","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"research","score"=>($positionCategory == 3 ? 4 : 3),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_research_proposal_ar_util_adopt","type"=>"input-number","label"=>"A, B, C, and D","dbColName"=>"number_of_research_proposal_ar_util_adopt","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"research","score"=>($positionCategory == 3 ? 5 : 4),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_research_proposal_ar_util_cite","type"=>"input-number","label"=>"A, B, C, and E","dbColName"=>"number_of_research_proposal_ar_util_cite","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"research","score"=>($positionCategory == 3 ? 5 : 4),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                    ],
                    "parentId"=>"accomplishments",
                    "score"=>0,
                    "weight"=>($positionCategory > 1 ? -1 : 0),
                    "maxPoints"=>($positionCategory == 1 ? 0 : ($positionCategory == 2 ? 4 : ($positionCategory == 3 ? 5 : 4))),
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                [
                    "id"=>"smetwg",
                    "type"=>"criteria2",
                    "label"=>"Subject Matter Expert/Membership in National Technical Working Groups (TWGs) or Committees",
                    "dbColName"=>"smetwg",
                    "dbTableName"=>"",
                    "content"=>[
                        [
                            "id"=>"smetwg_guide",
                            "type"=>"display-list-upper-alpha",
                            "label"=>"Guide",
                            "dbColName"=>"smetwg_guide",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"","type"=>"list-item","label"=>"Issuance/Memorandum","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"smetwg_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"list-item","label"=>"Certificate","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"smetwg_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"list-item","label"=>"Output/Adoption by the organization","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"smetwg_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
                            ],
                            "parentId"=>"smetwg",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        ["id"=>"number_of_smetwg_issuance_cert","type"=>"input-number","label"=>"A and B only","dbColName"=>"number_of_smetwg_issuance_cert","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"smetwg","score"=>2,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_smetwg_issuance_cert_output","type"=>"input-number","label"=>"All MOVs","dbColName"=>"number_of_smetwg_issuance_cert_output","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"smetwg","score"=>3,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                    ],
                    "parentId"=>"accomplishments",
                    "score"=>0,
                    "weight"=>($positionCategory > 1 ? -1 : 0),
                    "maxPoints"=>($positionCategory == 1 ? 0 : 3),
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                [
                    "id"=>"speakership",
                    "type"=>"criteria2",
                    "label"=>"Resource Speakership/Learning Facilitation",
                    "dbColName"=>"speakership",
                    "dbTableName"=>"",
                    "content"=>[
                        [
                            "id"=>"speakership_external",
                            "type"=>"criteria4",
                            "label"=>"Number of resource speakership/learning facilitation from external institution",
                            "dbColName"=>"speakership_external",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_speakership_external_office_level","type"=>"input-number","label"=>"Local office-level speakership","dbColName"=>"number_of_speakership_external_office_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_external","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_speakership_external_org_level_level","type"=>"input-number","label"=>"Organization-level speakership or higher","dbColName"=>"number_of_speakership_external_org_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_external","score"=>2,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                            ],
                            "parentId"=>"speakership",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"speakership_co",
                            "type"=>"criteria4",
                            "label"=>"Number of resource speakership/learning facilitation from the Central Office",
                            "dbColName"=>"speakership_co",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_speakership_central_co_level","type"=>"input-number","label"=>"Central Office-level speakership","dbColName"=>"number_of_speakership_central_co_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_co","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_speakership_central_national_level","type"=>"input-number","label"=>"National-level speakership or higher","dbColName"=>"number_of_speakership_central_national_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_co","score"=>2,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                            ],
                            "parentId"=>"speakership",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"speakership_ro",
                            "type"=>"criteria4",
                            "label"=>"Number of resource speakership/learning facilitation from the Regional Office",
                            "dbColName"=>"speakership_ro",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_speakership_regional_ro_level","type"=>"input-number","label"=>"Regional Office-level speakership","dbColName"=>"number_of_speakership_regional_ro_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_ro","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_speakership_regional_national_level","type"=>"input-number","label"=>"National-level speakership or higher","dbColName"=>"number_of_speakership_regional_national_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_ro","score"=>2,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                            ],
                            "parentId"=>"speakership",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"speakership_sdo",
                            "type"=>"criteria4",
                            "label"=>"Number of resource speakership/learning facilitation from the Schools Division Office",
                            "dbColName"=>"speakership_sdo",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_speakership_division_sdo_level","type"=>"input-number","label"=>"Division-/provincial-/city-level speakership","dbColName"=>"number_of_speakership_division_sdo_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_sdo","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_speakership_division_regional_level","type"=>"input-number","label"=>"Regional-level speakership or higher","dbColName"=>"number_of_speakership_division_regional_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_sdo","score"=>2,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                            ],
                            "parentId"=>"speakership",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"speakership_school",
                            "type"=>"criteria4",
                            "label"=>"Number of resource speakership/learning facilitation from schools",
                            "dbColName"=>"speakership_school",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_speakership_school_school_level","type"=>"input-number","label"=>"School/municipal/district speakership","dbColName"=>"number_of_speakership_school_school_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_school","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_speakership_school_sdo_level","type"=>"input-number","label"=>"Division-level speakership or higher","dbColName"=>"number_of_speakership_school_sdo_level","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"speakership_school","score"=>2,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                            ],
                            "parentId"=>"speakership",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ]
                    ],
                    "parentId"=>"accomplishments",
                    "score"=>0,
                    "weight"=>($positionCategory > 1 ? -1 : 0),
                    "maxPoints"=>($positionCategory == 1 ? 0 : 2),
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                [
                    "id"=>"neap",
                    "type"=>"criteria2",
                    "label"=>"NEAP Accredited Learning Facilitator",
                    "dbColName"=>"neap",
                    "dbTableName"=>"",
                    "content"=>[
                        [
                            "id"=>"neap_facilitator_accreditation",
                            "type"=>"input-radio-select",
                            "label"=>"Please select the applicant's highest level of accreditation as NEAP Learning Facilitator",
                            "dbColName"=>"neap_facilitator_accreditation",
                            "dbTableName"=>"Job_Application",
                            "content"=>[
                                ["id"=>"","type"=>"input-list-item","label"=>"None","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"neap_facilitator_accreditation","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"input-list-item","label"=>"Accredited by Regional Trainer","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"neap_facilitator_accreditation","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"input-list-item","label"=>"Accredited by National Trainer","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"neap_facilitator_accreditation","score"=>1.5,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"input-list-item","label"=>"Accredited by National Assessor","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"neap_facilitator_accreditation","score"=>2,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
                            ],
                            "parentId"=>"neap",
                            "score"=>1,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ]
                    ],
                    "parentId"=>"accomplishments",
                    "score"=>0,
                    "weight"=>($positionCategory > 1 ? -1 : 0),
                    "maxPoints"=>($positionCategory == 1 ? 0 : 2),
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"accomplishments","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"accomplishments_notes","type"=>"textarea","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"accomplishments_notes","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"accomplishments","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 1 ? 0 : ($positionCategory == 5 || ($positionCategory == 3 && 16 <= $salaryGrade && $salaryGrade <= 23)? 5 : 10)),
            "maxPoints"=>($positionCategory == 1 ? 0 : ($positionCategory == 5 || ($positionCategory == 3 && 16 <= $salaryGrade && $salaryGrade <= 23)? 5 : 10)),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"accomplishments_notes"
        ],
        [
            "id"=>"educationApp",
            "type"=>"criteria1",
            "label"=>"Application of Education",
            "dbColName"=>"educationApp",
            "dbTableName"=>"",
            "content"=>[
                [
                    "id"=>"educationApp_exp_required",
                    "type"=>"criteria4",
                    "label"=>"For Positions with Experience Requirement",
                    "dbColName"=>"educationApp_exp_required",
                    "dbTableName"=>"",
                    "content"=>[
                        [
                            "id"=>"educationApp_exp_required_guide",
                            "type"=>"display-list-upper-alpha",
                            "label"=>"Guide",
                            "dbColName"=>"educationApp_exp_required_guide",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"","type"=>"list-item","label"=>"Action Plan approved by the Head of Office","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"educationApp_exp_required_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"list-item","label"=>"Accomplishment Report verified by the Head of Office","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"educationApp_exp_required_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                                ["id"=>"","type"=>"list-item","label"=>"Certification of utilization/adoption signed by the Head of Office","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"educationApp_exp_required_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
                            ],
                            "parentId"=>"educationApp_exp_required",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"educationApp_exp_required_relevant",
                            "type"=>"criteria4",
                            "label"=>"Relevant",
                            "dbColName"=>"educationApp_exp_required_relevant",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_app_educ_r_actionplan","type"=>"input-number","label"=>"A Only","dbColName"=>"number_of_app_educ_r_actionplan","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"educationApp_exp_required_relevant","score"=>($positionCategory == 3 && ($salaryGrade == 27 || ($salaryGrade >= 16 && salaryGrade <= 23)) ? 9 : 5),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_app_educ_r_actionplan_ar","type"=>"input-number","label"=>"A and B","dbColName"=>"number_of_app_educ_r_actionplan_ar","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"educationApp_exp_required_relevant","score"=>($positionCategory == 3 && ($salaryGrade == 27 || ($salaryGrade >= 16 && salaryGrade <= 23)) ? 12 : 7),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_app_educ_r_actionplan_ar_adoption","type"=>"input-number","label"=>"All MOVs","dbColName"=>"number_of_app_educ_r_actionplan_ar_adoption","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"educationApp_exp_required_relevant","score"=>($positionCategory == 3 && ($salaryGrade == 27 || ($salaryGrade >= 16 && salaryGrade <= 23)) ? 15 : 10),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                            ],
                            "parentId"=>"educationApp_exp_required_guide",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ],
                        [
                            "id"=>"educationApp_exp_required_not_relevant",
                            "type"=>"criteria4",
                            "label"=>"Not Relevant",
                            "dbColName"=>"educationApp_exp_required_not_relevant",
                            "dbTableName"=>"",
                            "content"=>[
                                ["id"=>"number_of_app_educ_nr_actionplan","type"=>"input-number","label"=>"A Only","dbColName"=>"number_of_app_educ_nr_actionplan","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"educationApp_exp_required_not_relevant","score"=>($positionCategory == 3 && ($salaryGrade == 27 || ($salaryGrade >= 16 && salaryGrade <= 23)) ? 3 : 1),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_app_educ_nr_actionplan_ar","type"=>"input-number","label"=>"A and B","dbColName"=>"number_of_app_educ_nr_actionplan_ar","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"educationApp_exp_required_not_relevant","score"=>($positionCategory == 3 && ($salaryGrade == 27 || ($salaryGrade >= 16 && salaryGrade <= 23)) ? 6 : 3),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                                ["id"=>"number_of_app_educ_nr_actionplan_ar_adoption","type"=>"input-number","label"=>"All MOVs","dbColName"=>"number_of_app_educ_nr_actionplan_ar_adoption","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"educationApp_exp_required_not_relevant","score"=>($positionCategory == 3 && ($salaryGrade == 27 || ($salaryGrade >= 16 && salaryGrade <= 23)) ? 9 : 5),"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                            ],
                            "parentId"=>"educationApp_exp_required_guide",
                            "score"=>0,
                            "weight"=>-1,
                            "maxPoints"=>0,
                            "min"=>0,
                            "max"=>0,
                            "step"=>0
                        ]
                    ],
                    "parentId"=>"educationApp",
                    "score"=>0,
                    "weight"=>($positionRequiresExp ? -1 : 0),
                    "maxPoints"=>($positionRequiresExp ? ($positionCategory == 1 || $positionCategory == 5 ? 0 : ($positionCategory == 3 && 16 <= $salaryGrade && $salaryGrade <= 23 ? 15 : 10)) : 0),
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],            
                [
                    "id"=>"educationApp_exp_not_required",
                    "type"=>"criteria4",
                    "label"=>"For Positions with No Experience Requirement",
                    "dbColName"=>"educationApp_exp_not_required",
                    "dbTableName"=>"",
                    "content"=>[
                        ["id"=>"app_educ_gwa","type"=>"input-number","label"=>"Applicant’s GWA in the highest academic/grade level earned (actual/equivalent)","dbColName"=>"app_educ_gwa","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"educationApp_exp_not_required","score"=>1,"weight"=>($positionCategory == 3 && 16 <= salaryGrade && salaryGrade <= 23 ? 15 : 10),"maxPoints"=>0,"min"=>0,"max"=>100,"step"=>0]
                    ],
                    "parentId"=>"educationApp",
                    "score"=>0,
                    "weight"=>($positionRequiresExp ? 0 : -1),
                    "maxPoints"=>($positionRequiresExp ? ($positionCategory == 1 || $positionCategory == 5 ? 0 : ($positionCategory == 3 && 16 <= $salaryGrade && $salaryGrade <= 23 ? 15 : 10)) : 0),
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"educationApp","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"education_app_notes","type"=>"textarea","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"education_app_notes","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"educationApp","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 1 || $positionCategory == 5 ? 0 : ($positionCategory == 3 && 16 <= $salaryGrade && $salaryGrade <= 23 ? 15 : 10)),
            "maxPoints"=>($positionCategory == 1 || $positionCategory == 5 ? 0 : ($positionCategory == 3 && 16 <= $salaryGrade && $salaryGrade <= 23 ? 15 : 10)),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"education_app_notes"
        ],
        [
            "id"=>"trainingApp",
            "type"=>"criteria1",
            "label"=>"Application of Learning and Development",
            "dbColName"=>"trainingApp",
            "dbTableName"=>"",
            "content"=>[
                [
                    "id"=>"trainingApp_guide",
                    "type"=>"display-list-upper-alpha",
                    "label"=>"Guide",
                    "dbColName"=>"trainingApp_exp_guide",
                    "dbTableName"=>"",
                    "content"=>[
                        ["id"=>"","type"=>"list-item","label"=>"Certificate of Training","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainingApp_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                        ["id"=>"","type"=>"list-item","label"=>"Action Plan/Re-entry Action Plan/Job Embedded Learning/Impact Project signed by Head of Office","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainingApp_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                        ["id"=>"","type"=>"list-item","label"=>"Accomplishment Report adopted by local level","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainingApp_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                        ["id"=>"","type"=>"list-item","label"=>"Accomplishment Report adopted by different local level/higher level","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainingApp_guide","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
                    ],
                    "parentId"=>"trainingApp",
                    "score"=>0,
                    "weight"=>-1,
                    "maxPoints"=>0,
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                [
                    "id"=>"trainingApp_relevant",
                    "type"=>"criteria4",
                    "label"=>"Relevant",
                    "dbColName"=>"trainingApp_relevant",
                    "dbTableName"=>"",
                    "content"=>[
                        ["id"=>"number_of_app_train_relevant_cert_ap","type"=>"input-number","label"=>"A and B","dbColName"=>"number_of_app_train_relevant_cert_ap","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"trainingApp_relevant","score"=>5,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_app_train_relevant_cert_ap_arlocal","type"=>"input-number","label"=>"A, B, and C","dbColName"=>"number_of_app_train_relevant_cert_ap_arlocal","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"trainingApp_relevant","score"=>7,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_app_train_relevant_cert_ap_arlocal_arother","type"=>"input-number","label"=>"All MOVs","dbColName"=>"number_of_app_train_relevant_cert_ap_arlocal_arother","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"trainingApp_relevant","score"=>10,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                    ],
                    "parentId"=>"trainingApp_guide",
                    "score"=>0,
                    "weight"=>-1,
                    "maxPoints"=>0,
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                [
                    "id"=>"trainingApp_not_relevant",
                    "type"=>"criteria4",
                    "label"=>"Not Relevant",
                    "dbColName"=>"trainingApp_not_relevant",
                    "dbTableName"=>"",
                    "content"=>[
                        ["id"=>"number_of_app_train_not_relevant_cert_ap","type"=>"input-number","label"=>"A and B","dbColName"=>"number_of_app_train_not_relevant_cert_ap","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"trainingApp_not_relevant","score"=>1,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_app_train_not_relevant_cert_ap_arlocal","type"=>"input-number","label"=>"A, B, and C","dbColName"=>"number_of_app_train_not_relevant_cert_ap_arlocal","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"trainingApp_not_relevant","score"=>3,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1],
                        ["id"=>"number_of_app_train_not_relevant_cert_ap_arlocal_arother","type"=>"input-number","label"=>"All MOVs","dbColName"=>"number_of_app_train_not_relevant_cert_ap_arlocal_arother","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"trainingApp_not_relevant","score"=>5,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>"ANY","step"=>1]
                    ],
                    "parentId"=>"trainingApp_guide",
                    "score"=>0,
                    "weight"=>-1,
                    "maxPoints"=>0,
                    "min"=>0,
                    "max"=>0,
                    "step"=>0
                ],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"trainingApp","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"training_app_notes","type"=>"textarea","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"training_app_notes","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"trainingApp","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 1 || $positionCategory == 5 ? 0 : 10),
            "maxPoints"=>($positionCategory == 1 || $positionCategory == 5 ? 0 : 10),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"training_app_notes"
        ],
        [
            "id"=>"potential",
            "type"=>"criteria1",
            "label"=>"Potential",
            "sublabel"=>"Written Test, BEI" . ($positionCategory < 3 ? "" : ", Work Sample Test"),
            "dbColName"=>"potential",
            "dbTableName"=>"",
            "content"=>[
                // ["id"=>"score_exam","type"=>"input-number","label"=>"Written Examination","shortLabel"=>"Exam","dbColName"=>"score_exam","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"potential","score"=>1,"weight"=>($positionCategory == 1 ? -1 : ($positionCategory == 5 ? -1 : ($positionCategory == 2 && salaryGrade < 20 ? 10 : 5))),"maxPoints"=>0,"min"=>0,"max"=>100,"step"=>0.1],
                // ["id"=>"score_skill","type"=>"input-number","label"=>"Skills or Work Sample Test","shortLabel"=>"Skills Test","dbColName"=>"score_skill","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"potential","score"=>1,"weight"=>($positionCategory < 3 ? 0 : ($positionCategory == 5 ? -1 : ($positionCategory == 3 && salaryGrade == 24 ? 5 : 10))),"maxPoints"=>0,"min"=>0,"max"=>100,"step"=>0.1],
                // ["id"=>"score_bei","type"=>"input-number","label"=>"Behavioral Events Interview","shortLabel"=>"BEI","dbColName"=>"score_bei","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"potential","score"=>1,"weight"=>($positionCategory == 1 ? -1 : ($positionCategory == 5 ? -1 : ($positionCategory == 2 && salaryGrade >= 20 ? 10 : 5))),"maxPoints"=>0,"min"=>0,"max"=>($positionCategory == 1 ? -1 : ($positionCategory == 5 ? -1 : ($positionCategory == 2 && salaryGrade >= 20 ? 10 : 5))),"step"=>0.1],
                ["id"=>"score_exam","type"=>"input-number","label"=>"Written Examination","shortLabel"=>"Exam","dbColName"=>"score_exam","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"potential","score"=>1,"weight"=>($positionCategory == 1 ? -1 : ($positionCategory == 5 ? -1 : ($positionCategory == 2 && $salaryGrade < 20 ? 10 : 10))),"maxPoints"=>0,"min"=>0,"max"=>100,"step"=>0.1],
                ["id"=>"score_skill","type"=>"input-number","label"=>"Skills or Work Sample Test","shortLabel"=>"Skills Test","dbColName"=>"score_skill","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"potential","score"=>1,"weight"=>($positionCategory < 3 ? 0 : ($positionCategory == 5 ? -1 : ($positionCategory == 3 && $salaryGrade == 24 ? 0 : 0))),"maxPoints"=>0,"min"=>0,"max"=>100,"step"=>0.1],
                ["id"=>"score_bei","type"=>"input-number","label"=>"Behavioral Events Interview","shortLabel"=>"BEI","dbColName"=>"score_bei","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"potential","score"=>1,"weight"=>($positionCategory == 1 ? -1 : ($positionCategory == 5 ? -1 : ($positionCategory == 2 && $salaryGrade >= 20 ? 10 : 10))),"maxPoints"=>0,"min"=>0,"max"=>($positionCategory == 1 ? -1 : ($positionCategory == 5 ? -1 : ($positionCategory == 2 && $salaryGrade >= 20 ? 10 : 10))),"step"=>0.1],
                ["id"=>"","type"=>"line-break","label"=>"","dbColName"=>"","dbTableName"=>"","content"=>[],"parentId"=>"potential","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0],
                ["id"=>"potential_notes","type"=>"textarea","label"=>"Relevant documents or requirements submitted/Other remarks","dbColName"=>"potential_notes","dbTableName"=>"Job_Application","content"=>[],"parentId"=>"potential","score"=>0,"weight"=>-1,"maxPoints"=>0,"min"=>0,"max"=>0,"step"=>0]
            ],
            "parentId"=>null,
            "score"=>0,
            "weight"=>($positionCategory == 1 ? 0 : ($positionCategory == 5 ? 55 : ($positionCategory == 2 || ($positionCategory == 3 && $salaryGrade == 24) ? 15 : 20))),
            "maxPoints"=>($positionCategory == 1 ? 0 : ($positionCategory == 5 ? 55 : ($positionCategory == 2 || ($positionCategory == 3 && $salaryGrade == 24) ? 15 : 20))),
            "min"=>0,
            "max"=>0,
            "step"=>0,
            "notesId"=>"potential_notes"
        ],
    ];

    return $criteria;
}

function getPoints($criteria, $jobApplication)
{
    $points = 0;

    switch ($criteria['type'])
    {
        case "":
            break;
        case "input-number":
        case "input-radio-select":
            if (array_key_exists('getPointsManually', $criteria) && is_callable($criteria['getPointsManually']))
            {
                $points = call_user_func($criteria['getPointsManually'], 1);
            }
            else
            {
                // echo "<pre>";
                // var_export($jobApplication[$criteria['dbColName']], false);
                // echo "<br>";
                // var_export($criteria, false);
                // echo "</pre>";
                // $points = $criteria['score'] * ($jobApplication[$criteria['dbColName']] ?? 0) / ($criteria['weight'] < 0 ? 1 : $criteria['max'] / $criteria['weight']);
                $points = $criteria['score'] * ($jobApplication[$criteria['dbColName']] ?? 0) / ($criteria['weight'] <= 0 ? 1 : $criteria['max'] / $criteria['weight']);
            }
            if ($points < 0)
            {
                $points = 0;
            }
            break;
        case "criteria1":
        case "criteria2":
        case "criteria3":
        case "criteria4":
            if (array_key_exists('getPointsManually', $criteria) && is_callable($criteria['getPointsManually']))
            {
                $points = call_user_func($criteria['getPointsManually'], 1);
                if ($criteria['maxPoints'] > 0 && $points > $criteria['maxPoints'])
                {
                    $points = $criteria['maxPoints'];
                }
            }
            else
            {
                foreach ($criteria['content'] as $subcriteria)
                {
                    $points += getPoints($subcriteria, $jobApplication);
                    if ($criteria['maxPoints'] > 0 && $points > $criteria['maxPoints'])
                    {
                        $points = $criteria['maxPoints'];
                    }
                }
            }
            break;
        default:
            break;
    }

    return $points;
}

function getEducIncrements($educAttainment = 0, $degreesTaken = [['degree_typeIndex'=>0,'degree'=>"",'year_level_completed'=>null,'units_earned'=>null,'complete_academic_requirements'=>null,'graduation_year'=>null]])
{
    if (!is_numeric($educAttainment))
    {
        throw("Invalid argument type: educAttainment:" + $educAttainment);
    }

    if ($degreesTaken == null || !isset($degreesTaken) || (gettype($degreesTaken) == "array" && count($degreesTaken) == 0))
    {
        return ( $educAttainment == 8 ? 31 : ( $educAttainment == 7 ? 21 : $educAttainment )); // GIVES SOME "BENEFIT OF THE DOUBT" WHILE THE DEGREE INFORMATION IS UNAVAILABLE
    }
    else
    {
        $highestDegree = null;
        $highestIncrement = -1;

        foreach ($degreesTaken as $degree)
        {
            if ($highestDegree == null || $highestIncrement < getEducIncrementFromDegree($degree))
            {
                $highestDegree = $degree;
                $highestIncrement = getEducIncrementFromDegree($degree);
            }
        }

        return $highestIncrement;
    }
}

function getEducIncrementFromDegree($degree = ['degree_typeIndex'=>0,'degree'=>"",'year_level_completed'=>null,'units_earned'=>null,'complete_academic_requirements'=>null,'graduation_year'=>null])
{
    $minUnitsPerSem = 21; // ASSUMED NUMBER OF UNITS PER SEMESTER; CHANGE TO REFLECT POLICY
    $degreeName = null;
    $degreeType = null;
    $degreeGradYear = null;
    $degreeCAR = null;
    $degreeUnits = null;
    $degreeYearLevel = null;

    try
    {
        $degreeName = $degree["degree"]; // NOT USED
        $degreeType = $degree["degree_typeIndex"]; // 6-8
        $degreeGradYear = $degree["graduation_year"];
        $degreeCAR = $degree["complete_academic_requirements"];
        $degreeUnits = $degree["units_earned"];
        $degreeYearLevel = $degree["year_level_completed"];

        if ($degreeType >= 6)
        {
            if (is_numeric($degreeGradYear) && $degreeGradYear > 0)
            {
                return ($degreeType > 7 ? 31 : ($degreeType > 6 ? 21 : $degreeType)); // a graduate of a degree
            }
            else if ($degreeType == 6)
            {
                if (is_numeric($degreeYearLevel) && $degreeYearLevel >= 2 || is_numeric($degreeUnits) && $degreeUnits >= $minUnitsPerSem * 4)
                {
                    return 5; // finished the 2nd year of college
                }
                else
                {
                    return 4; // HS graduate only or finished less than two years in college
                }
            }
            else if ((is_numeric($degreeCAR) && $degreeCAR != 0) || (is_bool($degreeCAR) && $degreeCAR))
            {
                return ($degreeType > 7 ? 30 : 20); // assumes no degrees higher than a doctorate
            }
            else if (is_numeric($degreeUnits) && $degreeUnits > 0)
            {
                if ($degreeType > 7)
                {
                    return 21 + $degreeUnits / 3;
                }
                else
                {
                    return 6 + (($degreeUnits < 3 ? 3 : $degreeUnits) - 3) / 3; // REVISE IF NEEDED
                }
            }
        }
    }
    catch (Exception $ex)
    {
        echo "ERROR [static ScoreSheet.getEducIncrementFromDegree()]: " . $ex->getMessage();
    }

    return 0; // increments from degree are not applicable or the degree information is incomplete or invalid
}

function getEducScore($incrementAboveQS, $positionCategory, $salaryGrade)
{
    $uBoundsExclusive = [2, 4, 6, 8, 10];
    $scores = [0, 1, 2, 3, 4, 5];
    if ($positionCategory < 4)
    {
        $scores = [0, 2, 4, 6, 8, 10];
    }
    else if ($positionCategory > 4)
    {
        $uBoundsExclusive = [1, 2, 3, 4, 5];
    }
    else if ($positionCategory == 4 && $salaryGrade <= 9)
    {
        $uBoundsExclusive[0]--; // check page 4 of Enclosure No. 5 of DO 007 s 2023 for this tiny detail
    }
    else if ($salaryGrade == 24)
    {
        $uBoundsExclusive = [4, 6, 8, 9, 10];
        $scores = [0, 2, 4, 6, 8, 10];
    }

    $i = 0;

    while (array_key_exists($i, $uBoundsExclusive) && $uBoundsExclusive[$i] <= $incrementAboveQS)
    {
        $i++;
    }

    return $scores[$i];
}

function getTrainingScore($incrementAboveQS, $positionCategory, $salaryGrade)
{
    // var positionCategory = positionObj["position_categoryId"], salaryGrade = positionObj["salary_grade"];

    $uBoundsExclusive = [1, 2, 3, 4, 5];
    $scores = [0, 1, 2, 3, 4, 5];
    if ($positionCategory < 4)
    {
        $uBoundsExclusive = [2, 4, 6, 8, 10];
        $scores = [0, 2, 4, 6, 8, 10];
    }
    else if ($salaryGrade >= 10 && $salaryGrade <= 22 || $salaryGrade == 27)
    {
        $scores = [0, 2, 4, 6, 8, 10];
    }

    $i = 0;

    while (array_key_exists($i, $uBoundsExclusive) && $uBoundsExclusive[$i] <= $incrementAboveQS)
    {
        $i++;
    }

    return $scores[$i];
}

function getWorkExpScore($incrementAboveQS, $positionCategory, $salaryGrade)
{
    $uBoundsExclusive = [2, 4, 6, 8, 10];
    $scores = [0, 3, 6, 9, 12, 15];
    if ($positionCategory < 4)
    {
        $scores = [0, 2, 4, 6, 8, 10];
    }
    else if ($positionCategory > 4 || $salaryGrade <= 9)
    {
        $scores = [0, 4, 8, 12, 16, 20];
    }

    $i = 0;

    while (array_key_exists($i, $uBoundsExclusive) && $uBoundsExclusive[$i] <= $incrementAboveQS)
    {
        $i++;
    }

    return $scores[$i];
}

function getDuration($startDate, $endDate)
{
    $err = "";

    // var_dump($startDate);
    // var_dump($endDate);

    // [$startDate, $endDate] = [new Date($startDate), new Date($endDate)];

    if ($startDate == "Invalid Date")
    {
        $err += ($err == "" ? "" : "\n") + "Invalid Start Date";
    }

    if ($endDate == "Invalid Date")
    {
        $err += ($err == "" ? "" : "\n") + "Invalid End Date";
    }

    if ($err != "")
    {
        return $err;
    }

    $start = ['m'=>date('m', strtotime($startDate)), 'd'=>date('d', strtotime($startDate)), 'y'=>date('Y', strtotime($startDate))];
    $end = ['m'=>date('m', strtotime($endDate)), 'd'=>date('d', strtotime($endDate)), 'y'=>date('Y', strtotime($endDate))];

    $years = 0;
    $months = 0;
    $days = 0;
    $leapCount = 0;

    [$years, $months, $days] = [$end['y'] - $start['y'], $end['m'] - $start['m'], $end['d'] - $start['d'] + 1];
    $daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if ($days <= 0)
    {
        $months--;
        $days += $daysPerMonth[($end['m'] == 0 ? 11 : $end['m'] - 1)] + ($end['y'] % 4 == 0 && $end['m'] >= 1 || $start['y'] % 4 == 0 && $start['m'] <= 1 ? 1 : 0); // also adjust for leap years
    }

    if ($months < 0)
    {
        $years--;
        $months += 12;
    }

    if ($years < 0)
    {
        $days = intval(($endDate - $startDate) / 1000 / 60 / 60 / 24);
        $days -= ($days == 0 ? 1 : 0);
        $months = 0;
        $years = 0;
    }

    if ($days >= $daysPerMonth[($end['m'] == 0 ? 12 : $end['m'] - 1)] + ($end['y'] % 4 == 0 && $end['m'] >= 1 || $start['y'] % 4 == 0 && $start['m'] <= 1 ? 1 : 0))
    {
        $days -= $daysPerMonth[($end['m'] == 0 ? 12 : $end['m'] - 1)] + ($end['y'] % 4 == 0 && $end['m'] >= 1 || $start['y'] % 4 == 0 && $start['m'] <= 1 ? 1 : 0);
        $months++;

        if ($months >= 12)
        {
            $months -= 12;
            $years++;
        }
    }

    return ['y' => $years, 'm' => $months, 'd' => $days];
}

function convertDurationToNum($duration = ["y"=>0, "m"=>0, "d"=>0])
{

    return ($duration == null || !isset($duration) ? 0 : (is_string($duration) ? NAN : $duration['y'] + $duration['m'] / 12 + $duration['d'] / 365.25));
}

function addDuration($duration1, $duration2)
{
    // var years, months, days;
    if (is_null($duration1))
    {
        return $duration2;
    }

    [$years, $months, $days] = [$duration1['y'] + $duration2['y'], $duration1['m'] + $duration2['m'], $duration1['d'] + $duration2['d']];

    if (is_nan($years) || is_nan($months) || is_nan($days))
    {
        return ['y'=>0, 'm'=>0, 'd'=>0];
    }    

    $months += floor($days / 30);
    $days %= 30;

    $years += floor($months / 12);
    $months %= 12;

    return ['y'=>$years, 'm'=>$months, 'd'=>$days];
}    

/*
    static convertDurationToString(duration)
    {
        return (isNaN(duration.y) || isNaN(duration.m) || isNaN(duration.d) ? "Invalid date(s)" + (typeof(duration) == "string" ? "\n" + duration : "") : (duration.y > 0 ? duration.y + "&nbsp;year" + (duration.y == 1 ? "" : "s") : "") + (duration.m > 0 ? (duration.y > 0 ? ", " : "") + duration.m + "&nbsp;month" + (duration.m == 1 ? "" : "s") : "") + (duration.y + duration.m > 0 && duration.d != 0 ? ", " : "") + (duration.y + duration.m > 0 && duration.d == 0 ? "" : duration.d + "&nbsp;day" + (duration.d == 1 ? "" : "s")));
    }

*/

// TEST ONLY !!!!!!!!!!!!!
if (isset($_REQUEST['test']))
{
    // echo(json_encode_ex(new ajaxResponse('Info','test reply')));
    // echo(json_encode_ex(new ajaxResponse('Data',['a'=>'test reply'])));
    // $fieldStr = '';
    // $valueStr = '';
    // echo(json_encode_ex(new ajaxResponse('Data', generateFieldValueStr(['a'=>'test reply','b'=>'hello, world'], $fieldStr, $valueStr))));
    // echo(json_encode_ex(new ajaxResponse('Data', $fieldStr)));
    // echo(json_encode_ex(new ajaxResponse('Data', $valueStr)));
    ?>

<form class="data-form-ex" method="post" action="/mpasis/php/process.php" enctype="multipart/form-data"><h2>Upload Jobs Data</h2><span class="textbox-ex file-ex vertical" style="display: flex;"><label class="label-ex" for="jobs-csv">CSV for Upload:</label> <input type="file" id="jobs-csv" name="jobs-csv" accept="text/csv" style="width: 100%; border: 2px inset; background-color: white; padding: 1em;"></span><br><span class="textbox-ex hidden-ex"><input type="hidden" id="a" name="a" value="upload"></span><span class="button-ex"><button type="submit" id="ButtonEx1">Upload</button></span></form>

    <?php

    return;
}
// TEST ONLY !!!!!!!!!!!!!

// if (isValidUserSession())
// {    
//     if (isset($_REQUEST['q']) && $_REQUEST['q'] == 'login') // UNUSED
//     {
//         echo json_encode_ex(new ajaxResponse('User', json_encode_ex(array('Username'=>$_SESSION['user'], 'UserId'=>1 * $_SESSION['user_id']))));
//         return;
// 	}
//     elseif (isset($_REQUEST['a']) && $_REQUEST['a'] == 'logout') // UNUSED
//     {
//         $redirectToLogin = false;
//         require_once(__FILE_ROOT__ . '/php/secure/process_signout.php');

//         echo json_encode_ex(new ajaxResponse('Success', 'Signed out.'));
//         return;
//     }
//     elseif (isset($_REQUEST['a']))

//     {

        $dbconn = new DatabaseConnection($dbtype, $servername, $dbuser, $dbpass, $dbname, []);
        
        $positionTitle = '';
        $parenTitle = '';
        $plantilla = '';

        $positionTitle = (array_key_exists("positionTitle", $_REQUEST) ? trim($_REQUEST['positionTitle']) ?? '' : '');
        $parenTitle = (array_key_exists("parenTitle", $_REQUEST) ? trim($_REQUEST['parenTitle']) ?? '' : '');
        $plantilla = (array_key_exists("plantilla", $_REQUEST) ? trim($_REQUEST['plantilla']) ?? '' : '');

        $dbResults = $dbconn->select('Position', '*', 'WHERE' . ($plantilla != '' ? ' plantilla_item_number = "' . $plantilla . '"' : ($parenTitle != '' ? ' parenthetical_title = "' . $parenTitle . '" AND' : '') . ' position_title = "' . $positionTitle . '"')) ?? null;
        
        if (is_null($dbconn->lastException) && is_array($dbResults) && count($dbResults) > 0)
        {
            $positions = $dbResults;
            $position = $dbResults[0];
        }
        else
        {
            die(json_encode_ex(new ajaxResponse('Error', 'Position not found with the specified criteria.')));
        }

        $jobApplicationsJSON = selectJobApplications($dbconn, ($plantilla != '' ? ' plantilla_item_number_applied = "' . $plantilla . '"' : ($parenTitle != '' ? ' parenthetical_title_applied = "' . $parenTitle . '" AND' : '') . ' position_title_applied = "' . $positionTitle . '"'));
        $jobApplicationsJSONDecoded = json_decode($jobApplicationsJSON, true);
        $jobApplications = ($jobApplicationsJSONDecoded['type'] == 'Data' ? json_decode($jobApplicationsJSONDecoded['content'], true) : []);

        $criteria = getCriteria($position, $jobApplications[0] ?? []);
        $criteria_count = array_reduce($criteria, function($carry, $item) { return $carry + ($item['weight'] > 0 ? 1 : 0); }, 0);

        $educIncrementTable = $dbconn->select('MPS_Increment_Table_Education', '*', '');

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comparative Assessment Results | MPaSIS</title>
    <!-- <link rel="stylesheet" href="/mpasis/css/mpasisApp.css"> -->
     <style>
        .car-table {
            border-collapse: collapse;
            width: 100%;
            border: 1px solid;
        }

        .car-table > * > tr > * {
            border: 1px solid;
            padding: 0.25em;
        }
     </style>
</head>
<body>
    <div class="car-display">
        <h1 class="car-display-title">Comparative Assessment Results</h1>
        <main class="car-main">
            <form id="car-filter-form" class="car-filter-form" method="get" action="/mpasis/php/results.php" style="display: grid;">
                <input type="hidden" name="a" value="retrieve">
                <span class="textbox-ex"><label class="label-ex" for="position-title-input">Position Title:</label> <select id="position-title-input" name="positionTitle">
                    <optgroup>
                        <?php 
                        
                        $positionItems = ($dbconn->select('Position', 'DISTINCT position_title', 'ORDER BY position_title'));

                        if (is_null($dbconn->lastException))
                        {
                            array_unshift($positionItems, ['position_title' => '']); // Add an empty option at the beginning

                            for ($i = 0; $i < count($positionItems); $i++)
                            {
                                $positionItem = $positionItems[$i];
                                echo '<option value="' . htmlspecialchars($positionItem['position_title']) . '"' . ($positionTitle == $positionItem['position_title'] ? ' selected' : '') . '>' . htmlspecialchars($positionItem['position_title']) . '</option>';
                            }
                        }
                        else
                        {
                            echo '<option value="" disabled>Error fetching position titles</option>';
                        }

                        ?>
                    </optgroup>
                </select></span><br>
                <span class="textbox-ex"><label class="label-ex" for="paren-title-input">Parenthetical Title:</label> <select id="paren-title-input" name="parenTitle">
                    <optgroup>
                        <?php 
                        
                        $positionItems = ($dbconn->select('Position', 'DISTINCT parenthetical_title', 'ORDER BY parenthetical_title'));

                        if (is_null($dbconn->lastException))
                        {
                            array_unshift($positionItems, ['parenthetical_title' => '']); // Add an empty option at the beginning

                            for ($i = 0; $i < count($positionItems); $i++)
                            {
                                $positionItem = $positionItems[$i];
                                echo '<option value="' . htmlspecialchars($positionItem['parenthetical_title'] ?? '') . '"' . ($parenTitle == $positionItem['parenthetical_title'] ? ' selected' : '') . '>' . htmlspecialchars($positionItem['parenthetical_title'] ?? '') . '</option>';
                            }
                        }
                        else
                        {
                            echo '<option value="" disabled>Error fetching parenthetical titles</option>';
                        }

                        ?>
                    </optgroup>
                </select></span><br>
                <span class="textbox-ex"><label class="label-ex" for="plantilla-input">Plantilla Item Number:</label> <select id="plantilla-input" name="plantilla">
                    <optgroup>
                        <?php 
                        
                        $positionItems = ($dbconn->select('Position', 'DISTINCT plantilla_item_number', 'ORDER BY plantilla_item_number'));

                        if (is_null($dbconn->lastException))
                        {
                            array_unshift($positionItems, ['plantilla_item_number' => '']); // Add an empty option at the beginning

                            for ($i = 0; $i < count($positionItems); $i++)
                            {
                                $positionItem = $positionItems[$i];
                                echo '<option value="' . htmlspecialchars($positionItem['plantilla_item_number']) . '"' . ($plantilla == $positionItem['plantilla_item_number'] ? ' selected' : '') . '>' . htmlspecialchars($positionItem['plantilla_item_number']) . '</option>';
                            }
                        }
                        else
                        {
                            echo '<option value="" disabled>Error fetching plantilla item numbers</option>';
                        }

                        ?>
                    </optgroup>
                </select></span><br>
                <span class="button-ex"><button type="submit" id="car-filter-submit">Filter</button></span>
            </form>

            <br>

            <div class="car-table-container">
                <table class="car-table">
                    <thead>
                        <tr>
                            <th rowspan="2">#</th>
                            <th rowspan="2">Application Code</th>
                            <th colspan="<?php
                            print($criteria_count + 1);
                            ?>">Comparative Assessment Results</th>
                        </tr>
                        <tr><?php
                            for ($i = 0; $i < count($criteria); $i++)
                            {
                                if ($criteria[$i]['weight'] > 0)
                                {
                                    echo '<th>' . htmlspecialchars($criteria[$i]['label']) . '<br><i>(' . $criteria[$i]['weight'] . ' points)</i></th>';
                                }
                            }
                        ?>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody id="car-table-body"><?php 
                        if (count($jobApplications) > 0)
                        {
                            $evaluatedApplications = array_map(function($jobApplication, $i) use ($position) 
                            {
                                $criteria = getCriteria($position, $jobApplication);
                                $filteredCriteria = array_filter($criteria, function($criterion) { return $criterion['weight'] > 0; });

                                $jobApplication['criteria'] = $filteredCriteria;
                                
                                $scoreKeys = array_map(function($criterion) { return $criterion['dbColName']; }, $filteredCriteria);
                                array_push($scoreKeys, 'total');
                                $scoreValues = array_map(function($criterion) use ($jobApplication) { return ($jobApplication['has_attended_open_ranking'] ? getPoints($criterion, $jobApplication) : 0); }, $filteredCriteria);
                                array_push($scoreValues, array_sum($scoreValues));

                                $jobApplication['scores'] = array_combine($scoreKeys, $scoreValues);

                                $jobApplication['originalIndex'] = $i; // Store the original index for stable sorting

                                return $jobApplication;
                            }, $jobApplications, array_keys($jobApplications));

                            $evaluatedApplications = array_filter($evaluatedApplications, function($app) { return $app['include_in_car']; });
                            
                            uasort($evaluatedApplications, function($a, $b) { return $b['scores']['total'] <=> $a['scores']['total']; }); // sort according to rank
                            
                            $i = 0;

                            foreach ($evaluatedApplications as $evaluatedApplication)
                            {
                                echo '<tr>';
                                echo '<td>' . (++$i) . '</td>';
                                echo '<td>' . htmlspecialchars($evaluatedApplication['application_code']) . '</td>';

                                foreach ($evaluatedApplication['scores'] as $score)
                                {
                                    echo '<td>' . $score . '</td>';
                                }

                                echo '</tr>';
                            }
                        }
                        else
                        { ?>
                        <tr>
                            <td colspan="<?php print(2 + $criteria_count + 1); ?>">Nothing to show</td>
                        </tr><?php

                        } ?>
                    </tbody>
                </table>
            </div>
        </main>        
    </div>
</body>
</html>

<?php
        
//         return;
//     }
// }
// else // NOT SIGNED-IN
// {
//     $redirectToLogin = true;
//     require_once(__FILE_ROOT__ . '/php/secure/process_signout.php');
// }

// invalid query
// die(json_encode_ex(new ajaxResponse('Error', 'Unknown query.<br><br>Server Request: ' . json_encode_ex($_REQUEST))));
