# JUST FUCKING READ
# API list
http GET $API_HOST/prod/posts/for-board boardId==troll count==4 x-fr-auth-token:"guest:12341234"
http GET $API_HOST/prod/posts/for-board boardId==troll count==4 after==1646547819201 x-fr-auth-token:"guest:12341234"

http GET $API_HOST/prod/posts/VNYPEL x-fr-auth-token:"guest:12341234"
http GET $API_HOST/prod/posts/VNYPEL/comments x-fr-auth-token:"guest:12341234"
