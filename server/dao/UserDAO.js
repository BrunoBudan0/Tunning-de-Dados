// Acesso ao banco de dados de usuários
// Banco: Supabase (PostgreSQL)

import supabase from '../config/supabase.js';

class UserDAO {

  async findAll() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');

    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async save(userInstance) {
    const { data, error } = await supabase
      .from('usuarios')
      .insert(userInstance.toRecord())
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id) {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export default new UserDAO();
