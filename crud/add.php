<?php
require_once 'connect.php';
// Requête d'insertion en base de données
$req = "INSERT INTO tache(name_tache) VALUES(:tache)";

// Préparation de la requête
$data = $db->prepare($req);

// Execution de la requête avec les bonnes données
$data->execute(array(
    'tache' => "Mon article génial"
));
