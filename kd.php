<?php
echo "hola";

/**
 * Read post request with database statement
 */
$statements = $_POST['statements'];

$example = <<<EOT
{
"aircrafts": [
    {brand: "Boeing", model: "747"},
    {brand: "Airbus", model: "A380"},
    {brand: "Airbus", model: "A320"},
    {brand: "Boeing", model: "777"},
    {brand: "Boeing", model: "767"},
    {brand: "Cesna", model: "C208", variations: ["C208B", "C208D", "C208E"]},
    ]
}

EOT;





// Process statements
foreach ($statements as $statement) {
    $s = json_decode($statement);
    $command = $s->command;
    $conditions = $s->conditions;
    $values = $s->values;
}

function processStatement($command, $conditions, $values)
{

    switch ($command) {
        case "INSERT":
            $sql = "INSERT INTO ";
            break;
        case "UPDATE":
            $sql = "UPDATE ";
            break;
        case "DELETE":
            $sql = "DELETE FROM ";
            break;
        case "SELECT":
    }
}
