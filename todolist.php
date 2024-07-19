
<?php
    // Gérer les CORS
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // Si la méthode est OPTIONS, terminer ici (pour les requêtes préliminaires CORS)
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }


    require_once 'connect.php';

    // Ajouter une nouvelle tâche
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $name_tache = $_POST['name_tache'] ?? '';

        if (!empty($name_tache)) {
            $req = $db->prepare('INSERT INTO tache (name_tache) VALUES (:name_tache)');
            $req->bindParam(':name_tache', $name_tache);
            $req->execute();
        }
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') { // Mettre à jour le statut d'une tâche ou le nom de la tâche
        parse_str(file_get_contents("php://input"), $_PUT);
        $id = $_PUT['id'] ?? '';
        $completed = isset($_PUT['completed']) ? ($_PUT['completed'] === 'true' ? 1 : 0) : null;
        $name_tache = $_PUT['name_tache'] ?? null;

        if (!empty($id)) {
            if ($name_tache !== null) {
                $req = $db->prepare('UPDATE tache SET name_tache = :name_tache WHERE id_tache = :id');
                $req->bindParam(':name_tache', $name_tache);
                $req->bindParam(':id', $id);
                $req->execute();
            } elseif ($completed !== null) {
                $req = $db->prepare('UPDATE tache SET completed = :completed WHERE id_tache = :id');
                $req->bindParam(':completed', $completed, PDO::PARAM_BOOL);
                $req->bindParam(':id', $id);
                $req->execute();
            }
        }
        exit;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') { // Supprimer une tâche
        parse_str(file_get_contents("php://input"), $_DELETE);
        $id = $_DELETE['id'] ?? '';

        if (!empty($id)) {
            $req = $db->prepare('DELETE FROM tache WHERE id_tache = :id');
            $req->bindParam(':id', $id);
            $req->execute();
        }
        exit;
    } else { // Récupérer les tâches
        $req = $db->prepare('SELECT id_tache as id, name_tache as tache, completed FROM tache ORDER BY id_tache DESC');
        $req->execute();
        $datas = $req->fetchAll(PDO::FETCH_ASSOC);

        header('Content-Type: application/json');
        echo json_encode($datas);
    }
?>
