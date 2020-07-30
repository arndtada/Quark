function injectForEachInsn(method, opcode, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstInstruction(method,
        opcode);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstInstructionAfter(method,
            opcode,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'emote-update': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.client.renderer.entity.model.BipedModel',
                'methodName': 'func_225597_a_', // setRotationAngles
                'methodDesc': '(Lnet/minecraft/entity/LivingEntity;FFFFF)V'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachInsn(method, Opcodes.RETURN, function (target) {
                    var newInstructions = new InsnList();

                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 1));
                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "updateEmotes",
                        "(Lnet/minecraft/entity/LivingEntity;)V",
                        ASM.MethodType.STATIC
                    ));
                    method.instructions.insertBefore(target, newInstructions);
                })
            }
        }
    }
}
