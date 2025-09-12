# -*- encoding: utf-8 -*-
"""
Created by eniocc at 02/09/2025 at 21:40:02
Project api_desafio_frontend_cti_2025
app.py
"""
# -*- encoding: utf-8 -*-
"""
Created by eniocc at 02/09/2025 at 21:40:02
Project api_desafio_frontend_cti_2025
app.py (versão corrigida)
"""
"""
Sistema de API Flask com JWT, Roles, Permissions e Dashboard de Estatísticas
Versão completa e corrigida
"""

from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    create_access_token,
    get_jwt_identity,
    get_jwt,
    decode_token,
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from functools import wraps
from sqlalchemy import text
import os
import json

# Inicializar Flask
app = Flask(__name__)

# Configurações
app.config['JWT_SECRET_KEY'] = 'sua-chave-secreta-super-segura'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sistema_pericias.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicialização das extensões
db = SQLAlchemy(app)
jwt = JWTManager(app)

# ================== MODELOS DO BANCO DE DADOS ==================

# Tabela de associação many-to-many para usuários e roles
user_roles = db.Table(
    'user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True),
)

# Tabela de associação many-to-many para roles e permissions
role_permissions = db.Table(
    'role_permissions',
    db.Column('role_id', db.Integer, db.ForeignKey('roles.id'), primary_key=True),
    db.Column('permission_id', db.Integer, db.ForeignKey('permissions.id'), primary_key=True),
)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relacionamentos
    roles = db.relationship('Role', secondary=user_roles, backref='users')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def has_permission(self, permission_name):
        for role in self.roles:
            for permission in role.permissions:
                if permission.name == permission_name:
                    return True
        return False

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'active': self.active,
            'roles': [role.name for role in self.roles],
        }


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))

    # Relacionamentos
    permissions = db.relationship('Permission', secondary=role_permissions, backref='roles')


class Permission(db.Model):
    __tablename__ = 'permissions'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))


class Solicitacao(db.Model):
    __tablename__ = 'solicitacoes'
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.Date, nullable=False)
    hora = db.Column(db.Time, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    delegacia = db.Column(db.String(100), nullable=False)
    cidade = db.Column(db.String(100), nullable=False)
    tipo_ocorrencia = db.Column(db.String(100), nullable=False)
    numero_protocolo = db.Column(db.String(50))
    perito_responsavel = db.Column(db.String(100))
    observacoes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'data': self.data.strftime('%Y-%m-%d'),
            'hora': self.hora.strftime('%H:%M:%S'),
            'status': self.status,
            'delegacia': self.delegacia,
            'cidade': self.cidade,
            'tipo_ocorrencia': self.tipo_ocorrencia,
            'numero_protocolo': self.numero_protocolo,
            'perito_responsavel': self.perito_responsavel,
            'observacoes': self.observacoes,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }


# ================== DECORADORES E MIDDLEWARES ==================

def permission_required(permission_name):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)

            if not user or not user.active:
                return jsonify({'error': 'Usuário não encontrado ou inativo'}), 401

            if not user.has_permission(permission_name):
                return jsonify({'error': 'Permissão insuficiente'}), 403

            g.current_user = user
            return f(*args, **kwargs)

        return decorated_function

    return decorator


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token expirado'}), 401


@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({'error': 'Token inválido'}), 401


@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({'error': 'Token de acesso necessário'}), 401


# ================== CORS PARA DESENVOLVIMENTO ==================

@app.after_request
def after_request(response):
    """Adicionar headers CORS para desenvolvimento"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


# ================== ROTAS DE DEBUG PARA TESTES ==================

@app.route('/api/debug/token', methods=['POST'])
def debug_token():
    """Debug para verificar se o token está sendo gerado corretamente"""
    data = request.get_json()

    if not data or not data.get('username'):
        return jsonify({'error': 'Username é obrigatório para debug'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    # Gerar token para debug
    access_token = create_access_token(identity=user.id)

    return jsonify({
        'debug_info': {
            'user_id': user.id,
            'username': user.username,
            'token_length': len(access_token),
            'token_preview': access_token[:50] + '...',
            'full_token': access_token,
            'expires_in_hours': 1,
            'header_format': f'Authorization: Bearer {access_token}',
        }
    }), 200


@app.route('/api/debug/verify-token', methods=['GET'])
def debug_verify_token():
    """Debug para verificar se o token no header está válido"""
    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({
            'error': 'Header Authorization não encontrado',
            'received_headers': dict(request.headers),
            'expected_format': 'Authorization: Bearer <token>',
        }), 400

    if not auth_header.startswith('Bearer '):
        return jsonify({
            'error': 'Formato do header incorreto',
            'received': auth_header,
            'expected_format': 'Bearer <token>',
        }), 400

    token = auth_header.split(' ')[1] if len(auth_header.split(' ')) > 1 else None

    if not token:
        return jsonify({
            'error': 'Token não encontrado no header',
            'received_header': auth_header,
        }), 400

    try:
        decoded = decode_token(token)
        user_id = decoded.get('sub')
        user = User.query.get(user_id)

        return jsonify({
            'token_valid': True,
            'decoded_token': {
                'user_id': decoded.get('sub'),
                'expires': decoded.get('exp'),
                'issued_at': decoded.get('iat'),
                'type': decoded.get('type'),
            },
            'user_info': user.to_dict() if user else None,
            'token_preview': token[:50] + '...',
        }), 200

    except Exception as e:
        return jsonify({
            'token_valid': False,
            'error': str(e),
            'token_preview': token[:50] + '...' if token else None,
        }), 400


@app.route('/api/debug/headers', methods=['GET', 'POST'])
def debug_headers():
    """Debug para ver todos os headers recebidos"""
    return jsonify({
        'method': request.method,
        'headers': dict(request.headers),
        'authorization_header': request.headers.get('Authorization'),
        'has_bearer': request.headers.get('Authorization', '').startswith('Bearer ')
        if request.headers.get('Authorization')
        else False,
        'content_type': request.headers.get('Content-Type'),
        'user_agent': request.headers.get('User-Agent'),
    }), 200


@app.route('/api/debug/test-protected', methods=['GET'])
@jwt_required()
def debug_test_protected():
    """Endpoint protegido simples para teste"""
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    return jsonify({
        'message': 'Token válido! Acesso autorizado.',
        'current_user_id': current_user_id,
        'user_info': user.to_dict() if user else None,
        'timestamp': datetime.utcnow().isoformat(),
    }), 200


@app.route('/', methods=['GET'])
def index():
    """Página inicial da API"""
    return jsonify({
        'message': 'Sistema de Perícias - API REST',
        'status': 'running',
        'version': '1.0.0',
        'documentation': '/api/docs',
        'health_check': '/api/health',
        'login_endpoint': '/api/auth/login',
    }), 200


@app.route('/api/health', methods=['GET'])
def health_check():
    """Endpoint de verificação de saúde da API"""
    return jsonify({
        'status': 'ok',
        'message': 'API está funcionando',
        'timestamp': datetime.utcnow().isoformat(),
    }), 200


@app.route('/api/ping', methods=['GET'])
def ping():
    """Endpoint simples para teste de conectividade"""
    return jsonify({
        'message': 'pong',
        'timestamp': datetime.utcnow().isoformat(),
        'server': 'Flask API',
    }), 200


# ================== ROTAS DE AUTENTICAÇÃO ==================

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Username, email e password são obrigatórios'}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username já existe'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email já existe'}), 400

    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])

    # Adicionar role padrão se especificado
    if 'role' in data:
        role = Role.query.filter_by(name=data['role']).first()
        if role:
            user.roles.append(role)
    else:
        # Role padrão
        default_role = Role.query.filter_by(name='user').first()
        if default_role:
            user.roles.append(default_role)

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'Usuário criado com sucesso', 'user': user.to_dict()}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username e password são obrigatórios'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Credenciais inválidas'}), 401

    if not user.active:
        return jsonify({'error': 'Usuário inativo'}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({'access_token': access_token, 'user': user.to_dict()}), 200


@app.route('/api/auth/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({'error': 'Usuário não encontrado'}), 404

    return jsonify({'user': user.to_dict()}), 200


# ================== ROTAS DE SOLICITAÇÕES ==================

@app.route('/api/solicitacoes', methods=['GET'])
@permission_required('read_solicitacoes')
def get_solicitacoes():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status_filter = request.args.get('status')
    cidade_filter = request.args.get('cidade')

    # Construir query
    query = Solicitacao.query

    if status_filter:
        query = query.filter(Solicitacao.status == status_filter)

    if cidade_filter:
        query = query.filter(Solicitacao.cidade.contains(cidade_filter))

    # Paginação
    solicitacoes = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'solicitacoes': [sol.to_dict() for sol in solicitacoes.items],
        'pagination': {
            'page': page,
            'pages': solicitacoes.pages,
            'per_page': per_page,
            'total': solicitacoes.total,
            'has_next': solicitacoes.has_next,
            'has_prev': solicitacoes.has_prev,
        },
    }), 200


@app.route('/api/solicitacoes', methods=['POST'])
@permission_required('create_solicitacoes')
def create_solicitacao():
    data = request.get_json()

    required_fields = ['data', 'hora', 'status', 'delegacia', 'cidade', 'tipo_ocorrencia']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Campo {field} é obrigatório'}), 400

    try:
        data_obj = datetime.strptime(data['data'], '%Y-%m-%d').date()
        hora_obj = datetime.strptime(data['hora'], '%H:%M:%S').time()
    except ValueError:
        return jsonify({'error': 'Formato de data ou hora inválido'}), 400

    solicitacao = Solicitacao(
        data=data_obj,
        hora=hora_obj,
        status=data['status'],
        delegacia=data['delegacia'],
        cidade=data['cidade'],
        tipo_ocorrencia=data['tipo_ocorrencia'],
        numero_protocolo=data.get('numero_protocolo'),
        perito_responsavel=data.get('perito_responsavel'),
        observacoes=data.get('observacoes'),
    )

    db.session.add(solicitacao)
    db.session.commit()

    return jsonify({'message': 'Solicitação criada com sucesso', 'solicitacao': solicitacao.to_dict()}), 201


@app.route('/api/solicitacoes/<int:solicitacao_id>', methods=['PUT'])
@permission_required('update_solicitacoes')
def update_solicitacao(solicitacao_id):
    solicitacao = Solicitacao.query.get_or_404(solicitacao_id)
    data = request.get_json()

    if 'data' in data:
        try:
            solicitacao.data = datetime.strptime(data['data'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Formato de data inválido'}), 400

    if 'hora' in data:
        try:
            solicitacao.hora = datetime.strptime(data['hora'], '%H:%M:%S').time()
        except ValueError:
            return jsonify({'error': 'Formato de hora inválido'}), 400

    # Atualizar outros campos
    for field in ['status', 'delegacia', 'cidade', 'tipo_ocorrencia', 'numero_protocolo', 'perito_responsavel',
                  'observacoes']:
        if field in data:
            setattr(solicitacao, field, data[field])

    solicitacao.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({'message': 'Solicitação atualizada com sucesso', 'solicitacao': solicitacao.to_dict()}), 200


@app.route('/api/solicitacoes/<int:solicitacao_id>', methods=['DELETE'])
@permission_required('delete_solicitacoes')
def delete_solicitacao(solicitacao_id):
    solicitacao = Solicitacao.query.get_or_404(solicitacao_id)
    db.session.delete(solicitacao)
    db.session.commit()

    return jsonify({'message': 'Solicitação removida com sucesso'}), 200


# ================== ROTAS DE ESTATÍSTICAS ==================

@app.route('/api/dashboard/stats', methods=['GET'])
@permission_required('view_dashboard')
def get_dashboard_stats():
    # Consultas SQL para calcular as estatísticas
    stats_queries = {
        'novas_solicitacoes': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Nova' AND DATE(created_at) = DATE('now')
        """,
        'solicitacoes_recebidas': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Recebida'
        """,
        'solicitacoes_distribuidas': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Distribuída'
        """,
        'recebidas_por_perito': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Recebida por Perito'
        """,
        'pericias_em_andamento': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Em Andamento'
        """,
        'pericias_concluidas': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Concluída'
        """,
        'laudos_pendentes': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Laudo Pendente'
        """,
        'nao_pertencem_sip': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Não Pertence ao SIP'
        """,
        'pendentes_envio_sip': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Pendente de Envio ao SIP'
        """,
        'enviados_sip': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Enviado ao SIP'
        """,
        'em_custodia_nucleo': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Em Custódia do Núcleo'
        """,
        'cobranca': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Cobrança'
        """,
        'solicitacoes_devolvidas': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Devolvida'
        """,
        'solicitacoes_pausadas': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Pausada'
        """,
        'laudos_para_revisao': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Laudo para Revisão'
        """,
        'laudos_para_correcao': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'Laudo para Correção'
        """,
        'svo_laudos_pendentes': """
            SELECT COUNT(*) as count 
            FROM solicitacoes 
            WHERE status = 'SVO - Laudo Pendente'
        """,
    }

    stats = {}
    for key, query in stats_queries.items():
        try:
            result = db.session.execute(text(query)).fetchone()
            stats[key] = result[0] if result else 0
        except Exception:
            stats[key] = 0

    return jsonify({
        'statistics': {
            'Novas Solicitações': stats['novas_solicitacoes'],
            'Solicitações Recebidas': stats['solicitacoes_recebidas'],
            'Solicitações Distribuidas': stats['solicitacoes_distribuidas'],
            'Recebidas por Perito': stats['recebidas_por_perito'],
            'Perícias Em Andamento': stats['pericias_em_andamento'],
            'Perícias Concluídas': stats['pericias_concluidas'],
            'Laudos Pendentes': stats['laudos_pendentes'],
            'Não Pertencem ao SIP': stats['nao_pertencem_sip'],
            'Pendentes de envio ao SIP': stats['pendentes_envio_sip'],
            'Enviados ao SIP': stats['enviados_sip'],
            'Em custódia do Núcleo': stats['em_custodia_nucleo'],
            'Cobrança': stats['cobranca'],
            'Solicitações Devolvidas': stats['solicitacoes_devolvidas'],
            'Solicitações Pausadas': stats['solicitacoes_pausadas'],
            'Laudos Para Revisão': stats['laudos_para_revisao'],
            'Laudos para Correção': stats['laudos_para_correcao'],
            'SVO - Laudos Pendentes': stats['svo_laudos_pendentes'],
        }
    }), 200


# ================== ROTAS ADMINISTRATIVAS ==================

@app.route('/api/admin/users', methods=['GET'])
@permission_required('manage_users')
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    users = User.query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'users': [user.to_dict() for user in users.items],
        'pagination': {
            'page': page,
            'pages': users.pages,
            'per_page': per_page,
            'total': users.total,
        },
    }), 200


@app.route('/api/admin/roles', methods=['GET'])
@permission_required('manage_roles')
def get_roles():
    roles = Role.query.all()
    return jsonify({
        'roles': [
            {
                'id': role.id,
                'name': role.name,
                'description': role.description,
                'permissions': [perm.name for perm in role.permissions],
            }
            for role in roles
        ]
    }), 200


# ================== ROTAS DE SISTEMA ==================

@app.route('/api/system/info', methods=['GET'])
def system_info():
    """Informações do sistema"""
    try:
        user_count = User.query.count()
        role_count = Role.query.count()
        permission_count = Permission.query.count()
        solicitacao_count = Solicitacao.query.count()

        return jsonify({
            'system_info': {
                'users': user_count,
                'roles': role_count,
                'permissions': permission_count,
                'solicitacoes': solicitacao_count,
                'database': 'SQLite',
                'version': '1.0.0',
            }
        }), 200
    except Exception:
        return jsonify({
            'system_info': {
                'users': 0,
                'roles': 0,
                'permissions': 0,
                'solicitacoes': 0,
                'database': 'SQLite',
                'version': '1.0.0',
            }
        }), 200


@app.route('/api/system/status', methods=['GET'])
def system_status():
    """Status detalhado do sistema"""
    try:
        # Verificar conexão com banco
        db.session.execute(text('SELECT 1'))
        db_status = 'connected'

        # Verificar se há dados iniciais
        users_exist = User.query.first() is not None

        return jsonify({
            'status': 'healthy',
            'database': db_status,
            'initial_data': users_exist,
            'timestamp': datetime.utcnow().isoformat(),
            'endpoints': {
                'auth': '/api/auth/login',
                'dashboard': '/api/dashboard/stats',
                'solicitacoes': '/api/solicitacoes',
                'health': '/api/health',
            },
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'error': str(e), 'timestamp': datetime.utcnow().isoformat()}), 500


# ================== DOCUMENTAÇÃO DA API ==================

@app.route('/api/docs', methods=['GET'])
def api_docs():
    """Documentação básica da API"""
    return jsonify({
        'api_documentation': {
            'title': 'Sistema de Perícias - API REST',
            'version': '1.0.0',
            'description': 'API para gerenciamento de solicitações de perícia criminal',
            'base_url': 'http://localhost:5000',
            'authentication': 'JWT Bearer Token',
            'endpoints': {
                'auth': {
                    'login': 'POST /api/auth/login',
                    'register': 'POST /api/auth/register',
                    'profile': 'GET /api/auth/profile',
                },
                'solicitacoes': {
                    'list': 'GET /api/solicitacoes',
                    'create': 'POST /api/solicitacoes',
                    'update': 'PUT /api/solicitacoes/{id}',
                    'delete': 'DELETE /api/solicitacoes/{id}',
                },
                'dashboard': {
                    'stats': 'GET /api/dashboard/stats',
                },
                'admin': {
                    'users': 'GET /api/admin/users',
                    'roles': 'GET /api/admin/roles',
                },
                'system': {
                    'health': 'GET /api/health',
                    'status': 'GET /api/system/status',
                    'info': 'GET /api/system/info',
                    'docs': 'GET /api/docs',
                },
            },
            'test_users': {
                'admin': 'admin/admin123',
                'perito': 'perito1/perito123',
                'user': 'user1/user123',
            },
        }
    }), 200


# ================== FUNÇÃO DE INICIALIZAÇÃO ==================

def create_initial_data():
    """Cria dados iniciais do sistema"""

    # Verificar se já existem dados
    if User.query.first():
        print("✅ Banco de dados já contém dados.")
        return

    print("🔄 Criando dados iniciais...")

    # Criar permissions
    permissions_data = [
        ('read_solicitacoes', 'Visualizar solicitações'),
        ('create_solicitacoes', 'Criar solicitações'),
        ('update_solicitacoes', 'Atualizar solicitações'),
        ('delete_solicitacoes', 'Deletar solicitações'),
        ('view_dashboard', 'Visualizar dashboard'),
        ('manage_users', 'Gerenciar usuários'),
        ('manage_roles', 'Gerenciar roles'),
    ]

    permissions = []
    for name, desc in permissions_data:
        perm = Permission(name=name, description=desc)
        permissions.append(perm)
        db.session.add(perm)

    # Criar roles
    admin_role = Role(name='admin', description='Administrador do sistema')
    perito_role = Role(name='perito', description='Perito criminal')
    user_role = Role(name='user', description='Usuário padrão')

    # Associar permissions aos roles
    admin_role.permissions = permissions  # Admin tem todas as permissões
    perito_role.permissions = permissions[:5]  # Perito tem permissões básicas
    user_role.permissions = permissions[:2]  # User só visualiza

    db.session.add_all([admin_role, perito_role, user_role])

    # Criar usuários de teste
    admin_user = User(username='admin', email='admin@sistema.com')
    admin_user.set_password('admin123')
    admin_user.roles.append(admin_role)

    perito_user = User(username='perito1', email='perito1@sistema.com')
    perito_user.set_password('perito123')
    perito_user.roles.append(perito_role)

    regular_user = User(username='user1', email='user1@sistema.com')
    regular_user.set_password('user123')
    regular_user.roles.append(user_role)

    db.session.add_all([admin_user, perito_user, regular_user])
    db.session.commit()

    print("✅ Dados iniciais criados com sucesso!")
    print("🔑 Usuários disponíveis:")
    print("   - admin/admin123 (Administrador)")
    print("   - perito1/perito123 (Perito)")
    print("   - user1/user123 (Usuário)")


# ================== EXECUÇÃO PRINCIPAL ==================

def run_app():
    """Executa a aplicação"""
    print("🚀 INICIANDO SISTEMA DE PERÍCIAS")
    print("=" * 50)

    try:
        # Criar todas as tabelas
        with app.app_context():
            print("📊 Criando tabelas do banco de dados...")
            db.create_all()

            print("🔧 Verificando dados iniciais...")
            create_initial_data()

        print("\n🌐 API disponível em:")
        print("   http://localhost:5000")
        print("   http://127.0.0.1:5000")

        print("\n📋 Próximos passos:")
        print("   1. Execute 'python populate_db.py' para adicionar dados de teste")
        print("   2. Execute 'python test_api.py' para testar os endpoints")
        print("   3. Acesse http://localhost:5000/api/health para verificar status")

        print("\n🔄 Iniciando servidor Flask...")
        print("-" * 50)

        # Iniciar o servidor
        app.run(debug=True, host='0.0.0.0', port=5000)

    except Exception as e:
        print(f"❌ Erro ao inicializar aplicação: {e}")
        print("\n🔍 Possíveis soluções:")
        print("   1. Verifique se todas as dependências estão instaladas")
        print("   2. Certifique-se de que a porta 5000 está livre")
        print("   3. Execute em um ambiente virtual Python")


if __name__ == '__main__':
    run_app()
