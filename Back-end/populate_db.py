# -*- encoding: utf-8 -*-
"""
Created by eniocc at 02/09/2025 at 21:43:00
Project api_desafio_frontend_cti_2025
populate_db.py
"""

import os
import sqlite3
from datetime import datetime


def populate_database():
    """Popula o banco de dados com dados de teste do arquivo SQL"""

    # Verificar se o arquivo SQL existe
    sql_file = 'populate_data.sql'
    if not os.path.exists(sql_file):
        print(f"Erro: Arquivo {sql_file} não encontrado!")
        print("Certifique-se de que o arquivo populate_data.sql está no mesmo diretório.")
        return False

    # Conectar ao banco de dados
    db_path = 'instance/sistema_pericias.db'
    if not os.path.exists(db_path):
        print(f"Erro: Banco de dados {db_path} não encontrado!")
        print("Execute primeiro a aplicação Flask para criar o banco de dados.")
        return False

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Verificar se já existem dados
        cursor.execute("SELECT COUNT(*) FROM solicitacoes")
        count = cursor.fetchone()[0]

        if count > 0:
            response = input(
                f"O banco já contém {count} solicitações. Deseja continuar e adicionar mais dados? (s/N): ")
            if response.lower() != 's':
                print("Operação cancelada.")
                return False

        # Ler e executar o arquivo SQL
        with open(sql_file, 'r', encoding='utf-8') as file:
            sql_content = file.read()

        print("Populando banco de dados...")

        # Executar os comandos SQL
        cursor.executescript(sql_content)
        conn.commit()

        # Verificar quantos registros foram inseridos
        cursor.execute("SELECT COUNT(*) FROM solicitacoes")
        total_count = cursor.fetchone()[0]
        new_records = total_count - count

        print(f"✅ Sucesso! {new_records} novos registros inseridos.")
        print(f"📊 Total de solicitações no banco: {total_count}")

        # Mostrar estatísticas por status
        print("\n📈 Distribuição por status:")
        cursor.execute("""
            SELECT status, COUNT(*) as quantidade 
            FROM solicitacoes 
            GROUP BY status 
            ORDER BY quantidade DESC
        """)

        for status, quantidade in cursor.fetchall():
            print(f"  • {status}: {quantidade}")

        return True

    except sqlite3.Error as e:
        print(f"❌ Erro ao popular banco de dados: {e}")
        return False

    finally:
        if conn:
            conn.close()


def generate_additional_test_data():
    """Gera dados de teste adicionais programaticamente"""

    import random
    from datetime import date, time, timedelta

    # Listas para dados aleatórios
    delegacias = [
        "1ª DP Centro", "2ª DP Aldeota", "3ª DP Pirambu", "4ª DP Montese",
        "5ª DP Antônio Bezerra", "6ª DP Messejana", "7ª DP Barra do Ceará",
        "8ª DP Canindezinho", "9ª DP Bom Jardim", "10ª DP Conjunto Ceará",
        "DP Caucaia", "DP Maracanaú", "DP Sobral", "DP Juazeiro do Norte",
        "DP Crato", "DP Iguatu", "DP Quixadá", "DP Itapipoca"
    ]

    cidades = [
        "Fortaleza", "Caucaia", "Maracanaú", "Sobral", "Juazeiro do Norte",
        "Crato", "Iguatu", "Quixadá", "Itapipoca", "Camocim", "Aracati",
        "Cascavel", "Pacajus", "Horizonte", "Russas", "Limoeiro do Norte"
    ]

    tipos_ocorrencia = [
        "Homicídio", "Roubo", "Furto", "Latrocínio", "Estupro", "Lesão Corporal",
        "Tráfico", "Falsificação", "Estelionato", "Sequestro", "Extorsão",
        "Ameaça", "Corrupção", "Peculato", "Fraude", "Lavagem de Dinheiro"
    ]

    status_list = [
        "Nova", "Recebida", "Distribuída", "Recebida por Perito", "Em Andamento",
        "Concluída", "Laudo Pendente", "Enviado ao SIP", "Pausada", "Devolvida"
    ]

    peritos = [
        "Dr. João Silva", "Dra. Maria Santos", "Dr. Carlos Pereira",
        "Dra. Ana Costa", "Dr. Pedro Lima", "Dra. Lucia Almeida",
        "Dr. Roberto Oliveira", "Dra. Sandra Ferreira", "Dr. Marcos Andrade"
    ]

    try:
        conn = sqlite3.connect(r'instance/sistema_pericias.db')
        cursor = conn.cursor()

        print("\n🔄 Gerando dados adicionais...")

        # Gerar 50 registros adicionais
        for i in range(50):
            # Data aleatória nos últimos 30 dias
            days_ago = random.randint(0, 30)
            data_obj = date.today() - timedelta(days=days_ago)

            # Hora aleatória
            hora_obj = time(
                hour=random.randint(8, 18),
                minute=random.randint(0, 59),
                second=random.randint(0, 59)
            )

            # Selecionar dados aleatórios
            delegacia = random.choice(delegacias)
            cidade = random.choice(cidades)
            tipo_ocorrencia = random.choice(tipos_ocorrencia)
            status = random.choice(status_list)
            perito = random.choice(peritos) if status not in ["Nova", "Recebida"] else None

            # Gerar número de protocolo
            numero_protocolo = f"SOL-2025-{1000 + i}"

            # Observações aleatórias
            observacoes_list = [
                "Caso de alta complexidade",
                "Prioridade normal",
                "Aguardando documentos complementares",
                "Material coletado no local",
                "Testemunhas identificadas",
                "Evidências preservadas",
                "Análise em laboratório",
                "Caso urgente"
            ]
            observacoes = random.choice(observacoes_list)

            # Inserir no banco
            cursor.execute("""
                INSERT INTO solicitacoes (
                    data, hora, status, delegacia, cidade, tipo_ocorrencia,
                    numero_protocolo, perito_responsavel, observacoes, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                data_obj.strftime('%Y-%m-%d'),
                hora_obj.strftime('%H:%M:%S'),
                status,
                delegacia,
                cidade,
                tipo_ocorrencia,
                numero_protocolo,
                perito,
                observacoes,
                datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            ))

        conn.commit()

        # Verificar total
        cursor.execute("SELECT COUNT(*) FROM solicitacoes")
        total = cursor.fetchone()[0]

        print(f"✅ 50 registros adicionais criados! Total: {total} solicitações")

        return True

    except sqlite3.Error as e:
        print(f"❌ Erro ao gerar dados adicionais: {e}")
        return False

    finally:
        if conn:
            conn.close()


def show_statistics():
    """Mostra estatísticas do banco de dados"""

    try:
        conn = sqlite3.connect(r'instance/sistema_pericias.db')
        cursor = conn.cursor()

        print("\n📊 ESTATÍSTICAS DO SISTEMA")
        print("=" * 50)

        # Estatísticas gerais
        cursor.execute("SELECT COUNT(*) FROM solicitacoes")
        total = cursor.fetchone()[0]
        print(f"Total de Solicitações: {total}")

        cursor.execute("SELECT COUNT(*) FROM users")
        users = cursor.fetchone()[0]
        print(f"Total de Usuários: {users}")

        # Estatísticas por status (conforme solicitado)
        stats_queries = {
            'Novas Solicitações': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Nova' AND DATE(created_at) = DATE('now')",
            'Solicitações Recebidas': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Recebida'",
            'Solicitações Distribuidas': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Distribuída'",
            'Recebidas por Perito': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Recebida por Perito'",
            'Perícias Em Andamento': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Em Andamento'",
            'Perícias Concluídas': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Concluída'",
            'Laudos Pendentes': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Laudo Pendente'",
            'Não Pertencem ao SIP': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Não Pertence ao SIP'",
            'Pendentes de envio ao SIP': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Pendente de Envio ao SIP'",
            'Enviados ao SIP': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Enviado ao SIP'",
            'Em custódia do Núcleo': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Em Custódia do Núcleo'",
            'Cobrança': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Cobrança'",
            'Solicitações Devolvidas': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Devolvida'",
            'Solicitações Pausadas': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Pausada'",
            'Laudos Para Revisão': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Laudo para Revisão'",
            'Laudos para Correção': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'Laudo para Correção'",
            'SVO - Laudos Pendentes': "SELECT COUNT(*) FROM solicitacoes WHERE status = 'SVO - Laudo Pendente'"
        }

        print("\n🎯 DASHBOARD DE ESTATÍSTICAS:")
        print("-" * 50)

        for label, query in stats_queries.items():
            cursor.execute(query)
            count = cursor.fetchone()[0]
            print(f"{label}: {count}")

        # Top 5 cidades
        print("\n🏙️  TOP 5 CIDADES:")
        print("-" * 30)
        cursor.execute("""
            SELECT cidade, COUNT(*) as total 
            FROM solicitacoes 
            GROUP BY cidade 
            ORDER BY total DESC 
            LIMIT 5
        """)

        for cidade, total in cursor.fetchall():
            print(f"{cidade}: {total}")

        # Top 5 tipos de ocorrência
        print("\n🚨 TOP 5 TIPOS DE OCORRÊNCIA:")
        print("-" * 35)
        cursor.execute("""
            SELECT tipo_ocorrencia, COUNT(*) as total 
            FROM solicitacoes 
            GROUP BY tipo_ocorrencia 
            ORDER BY total DESC 
            LIMIT 5
        """)

        for tipo, total in cursor.fetchall():
            print(f"{tipo}: {total}")

        # Peritos mais ativos
        print("\n👨‍🔬 TOP 5 PERITOS MAIS ATIVOS:")
        print("-" * 35)
        cursor.execute("""
            SELECT perito_responsavel, COUNT(*) as total 
            FROM solicitacoes 
            WHERE perito_responsavel IS NOT NULL 
            GROUP BY perito_responsavel 
            ORDER BY total DESC 
            LIMIT 5
        """)

        for perito, total in cursor.fetchall():
            print(f"{perito}: {total}")

    except sqlite3.Error as e:
        print(f"❌ Erro ao mostrar estatísticas: {e}")

    finally:
        if conn:
            conn.close()


def main():
    """Função principal do script"""

    print("🚀 SISTEMA DE POPULAÇÃO DO BANCO DE DADOS")
    print("=" * 50)

    while True:
        print("\nOpções disponíveis:")
        print("1. Popular com dados do arquivo SQL")
        print("2. Gerar dados adicionais aleatórios")
        print("3. Mostrar estatísticas")
        print("4. Executar tudo (popular + gerar + estatísticas)")
        print("5. Sair")

        choice = input("\nEscolha uma opção (1-5): ").strip()

        if choice == '1':
            populate_database()
        elif choice == '2':
            generate_additional_test_data()
        elif choice == '3':
            show_statistics()
        elif choice == '4':
            print("🔄 Executando sequência completa...")
            if populate_database():
                generate_additional_test_data()
            show_statistics()
        elif choice == '5':
            print("👋 Saindo...")
            break
        else:
            print("❌ Opção inválida. Tente novamente.")


if __name__ == "__main__":
    main()
